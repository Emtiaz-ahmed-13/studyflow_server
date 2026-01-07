import { RecommendationType } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { IStudyPattern } from "./ai-recommendation.interface";

const analyzeStudyPatterns = async (userId: string): Promise<IStudyPattern> => {

    const studySessions = await prisma.studySession.findMany({
        where: { userId },
        include: {
            subject: true,
        },
        orderBy: {
            startTime: "desc",
        },
        take: 100,
    });

    if (studySessions.length === 0) {
        throw new ApiError(404, "No study sessions found for analysis");
    }
    let totalStudyTime = 0;
    let totalProductivity = 0;
    const hourDistribution: Record<number, number> = {};
    const subjectPerformance: Record<string, { time: number; productivity: number }> = {};

    studySessions.forEach((session) => {
        const duration = session.duration || 0;
        const productivity = session.productivity || 0;

        totalStudyTime += duration;
        totalProductivity += productivity;
        const hour = new Date(session.startTime).getHours();
        hourDistribution[hour] = (hourDistribution[hour] || 0) + 1;

        if (session.subject) {
            if (!subjectPerformance[session.subject.name]) {
                subjectPerformance[session.subject.name] = { time: 0, productivity: 0 };
            }
            subjectPerformance[session.subject.name].time += duration;
            subjectPerformance[session.subject.name].productivity += productivity;
        }
    });
    const preferredStudyHours = Object.entries(hourDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));
    const subjects = Object.entries(subjectPerformance).map(([name, data]) => ({
        name,
        avgProductivity: data.productivity / (data.time / 60),
    }));

    subjects.sort((a, b) => a.avgProductivity - b.avgProductivity);

    const weakSubjects = subjects.slice(0, 3).map((s) => s.name);
    const strongSubjects = subjects.slice(-3).map((s) => s.name);
    const streak = await prisma.studyStreak.findUnique({
        where: { userId },
    });
    const wellnessActivities = await prisma.meditationSession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 50,
    });

    let totalStress = 0;
    let stressCount = 0;
    wellnessActivities.forEach(session => {
        if (session.stressLevelBefore) {
            totalStress += session.stressLevelBefore;
            stressCount++;
        }
    });
    const averageStress = stressCount > 0 ? totalStress / stressCount : 0;
    const techniqueSessions = await prisma.studyTechnique.findMany({
        where: { userId },
        take: 50,
    });

    const techniqueEffectiveness: Record<string, number> = {};
    const techniqueCount: Record<string, number> = {};

    techniqueSessions.forEach(session => {
        if (session.effectiveness) {
            if (!techniqueEffectiveness[session.type]) {
                techniqueEffectiveness[session.type] = 0;
                techniqueCount[session.type] = 0;
            }
            techniqueEffectiveness[session.type] += session.effectiveness;
            techniqueCount[session.type]++;
        }
    });
    Object.keys(techniqueEffectiveness).forEach(key => {
        techniqueEffectiveness[key] = techniqueEffectiveness[key] / techniqueCount[key];
    });
    const correlatedWeaknesses: string[] = [];
    if (averageStress > 7 && (totalProductivity / studySessions.length) < 50) {
        correlatedWeaknesses.push("PERFORMANCE_ANXIETY");
    }
    const avgDuration = totalStudyTime / studySessions.length;
    if (avgDuration < 20 && Object.values(techniqueEffectiveness).some(v => v < 3)) {
        correlatedWeaknesses.push("FOCUS_RETENTION_ISSUE");
    }

    if (avgDuration > 60 && Object.values(techniqueEffectiveness).every(v => v < 3)) {
        correlatedWeaknesses.push("INEFFICIENT_STUDY_METHOD");
    }

    return {
        userId,
        totalStudyTime,
        averageSessionDuration: avgDuration,
        averageProductivity: totalProductivity / studySessions.length,
        preferredStudyHours,
        weakSubjects,
        strongSubjects,
        streakData: {
            current: streak?.currentStreak || 0,
            longest: streak?.longestStreak || 0,
        },
        wellnessMetrics: {
            averageStress,
            averageFocus: 0,
        },
        techniqueEffectiveness,
        correlatedWeaknesses
    };
};
const generateRecommendations = async (userId: string) => {
    const patterns = await analyzeStudyPatterns(userId);
    const recommendations = [];
    if (patterns.preferredStudyHours.length > 0) {
        const hours = patterns.preferredStudyHours.map((h) => `${h}:00`).join(", ");
        recommendations.push({
            userId,
            type: RecommendationType.STUDY_TIME,
            title: "Optimal Study Time Detected",
            description: `Based on your history, you're most productive during ${hours}. Schedule important study sessions during these hours.`,
            priority: 2,
            metadata: {
                preferredHours: patterns.preferredStudyHours,
            },
        });
    }
    if (patterns.averageSessionDuration < 25) {
        recommendations.push({
            userId,
            type: RecommendationType.FOCUS_DURATION,
            title: "Increase Focus Session Length",
            description: `Your average session is ${Math.round(patterns.averageSessionDuration)} minutes. Try gradually increasing to 25-30 minutes for better deep work.`,
            priority: 1,
            metadata: {
                currentAverage: patterns.averageSessionDuration,
                suggested: 25,
            },
        });
    } else if (patterns.averageSessionDuration > 90) {
        recommendations.push({
            userId,
            type: RecommendationType.FOCUS_DURATION,
            title: "Take More Breaks",
            description: `Your sessions average ${Math.round(patterns.averageSessionDuration)} minutes. Consider shorter sessions with breaks to maintain productivity.`,
            priority: 2,
            metadata: {
                currentAverage: patterns.averageSessionDuration,
                suggested: 60,
            },
        });
    }
    if (patterns.weakSubjects.length > 0) {
        recommendations.push({
            userId,
            type: RecommendationType.SUBJECT_PRIORITY,
            title: "Focus on Weak Subjects",
            description: `Prioritize studying ${patterns.weakSubjects.join(", ")}. These subjects show lower productivity scores.`,
            priority: 2,
            metadata: {
                weakSubjects: patterns.weakSubjects,
            },
        });
    }
    if (patterns.averageProductivity < 50) {
        recommendations.push({
            userId,
            type: RecommendationType.WORKLOAD_ADJUSTMENT,
            title: "Reduce Study Workload",
            description: `Your productivity score is ${Math.round(patterns.averageProductivity)}%. Consider reducing daily workload and focusing on quality over quantity.`,
            priority: 2,
            metadata: {
                currentProductivity: patterns.averageProductivity,
            },
        });
    }
    if (patterns.streakData.current === 0 && patterns.streakData.longest > 0) {
        recommendations.push({
            userId,
            type: RecommendationType.BREAK_REMINDER,
            title: "Rebuild Your Streak",
            description: `You had a ${patterns.streakData.longest}-day streak before! Start studying today to rebuild your momentum.`,
            priority: 1,
            metadata: {
                longestStreak: patterns.streakData.longest,
            },
        });
    }
    if (patterns.weakSubjects.length > 0) {
        recommendations.push({
            userId,
            type: RecommendationType.STUDY_TECHNIQUE_SUGGESTION,
            title: "Try the Feynman Technique",
            description: `For ${patterns.weakSubjects[0]}, try explaining concepts simply to consolidate your understanding.`,
            priority: 2,
            metadata: {
                technique: "FEYNMAN_TECHNIQUE",
                subject: patterns.weakSubjects[0]
            }
        });
    }
    if (patterns.averageProductivity < 40) {
        recommendations.push({
            userId,
            type: RecommendationType.MEDITATION_REMINDER,
            title: "Mindfulness Reset",
            description: "Your productivity seems low. A 5-minute mindfulness session can help reset your focus.",
            priority: 3,
            metadata: {
                suggestedDuration: 5,
                type: "MINDFULNESS"
            }
        });
    }
    recommendations.push({
        userId,
        type: RecommendationType.HABIT_CHALLENGE_PROMPT,
        title: "Start a 21-Day Challenge",
        description: "Build a lasting habit! Join the 21-Day Active Recall Challenge to master your subjects.",
        priority: 1,
        metadata: {
            challengeType: "ACTIVE_RECALL_21_DAY"
        }
    });
    if (patterns.strongSubjects.length > 1) {
        recommendations.push({
            userId,
            type: RecommendationType.STUDY_TECHNIQUE_SUGGESTION,
            title: "Mix It Up with Interleaved Practice",
            description: `Switch between ${patterns.strongSubjects.slice(0, 2).join(" and ")} in a single session to improve problem-solving.`,
            priority: 2,
            metadata: {
                technique: "INTERLEAVED_PRACTICE",
                subjects: patterns.strongSubjects.slice(0, 2)
            }
        });
    }
    if (patterns.weakSubjects.length > 0) {
        recommendations.push({
            userId,
            type: RecommendationType.STUDY_TECHNIQUE_SUGGESTION,
            title: "Create an Active Error Log",
            description: `For ${patterns.weakSubjects[0]}, log every mistake you make and the correct reasoning. This stops repeat errors.`,
            priority: 1,
            metadata: {
                technique: "ACTIVE_ERROR_LOG",
                subject: patterns.weakSubjects[0]
            }
        });
    }
    if (patterns.averageProductivity < 30) {
        recommendations.push({
            userId,
            type: RecommendationType.MEDITATION_REMINDER,
            title: "5-4-3-2-1 Grounding Technique",
            description: "Feeling scattered? Try the 5-4-3-2-1 technique to instantly reset your focus and anxiety.",
            priority: 1,
            metadata: {
                technique: "GROUNDING_54321",
                type: "ANXIETY_RELIEF"
            }
        });
    }
    if (patterns.averageSessionDuration > 50) {
        recommendations.push({
            userId,
            type: RecommendationType.STUDY_TECHNIQUE_SUGGESTION,
            title: "Try Pomodoro Plus",
            description: "Long sessions can lead to burnout. Try 25m study + 5m break cycles to maintain energy.",
            priority: 2,
            metadata: {
                technique: "POMODORO_PLUS",
                suggestedCycle: "25/5"
            }
        });
    }
    if (patterns.correlatedWeaknesses.includes("PERFORMANCE_ANXIETY")) {
        recommendations.push({
            userId,
            type: RecommendationType.MEDITATION_REMINDER,
            title: "Overcome Exam Anxiety",
            description: "We detected high stress patterns. Try 'Alpha State Breathing' (4-2-6) for 5 minutes before your next study session.",
            priority: 1,
            metadata: {
                technique: "ALPHA_STATE_BREATHING",
                context: "PRE_STUDY"
            }
        });
    }

    if (patterns.correlatedWeaknesses.includes("FOCUS_RETENTION_ISSUE")) {
        recommendations.push({
            userId,
            type: RecommendationType.STUDY_TECHNIQUE_SUGGESTION,
            title: "Improve Focus Retention",
            description: "Short sessions with low effectiveness detected. Try the 'Blur + Teach' method to actively engage your brain.",
            priority: 1,
            metadata: {
                technique: "BLUR_TEACH_METHOD"
            }
        });
    }
    const created = await prisma.aIRecommendation.createMany({
        data: recommendations,
    });

    return { created: created.count, recommendations };
};

const getUserRecommendations = async (userId: string, includeApplied = false) => {
    const where: any = { userId };

    if (!includeApplied) {
        where.isApplied = false;
    }

    const recommendations = await prisma.aIRecommendation.findMany({
        where,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return recommendations;
};

const applyRecommendation = async (recommendationId: string, userId: string) => {
    const recommendation = await prisma.aIRecommendation.findUnique({
        where: { id: recommendationId },
    });

    if (!recommendation) {
        throw new ApiError(404, "Recommendation not found");
    }

    if (recommendation.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    const updated = await prisma.aIRecommendation.update({
        where: { id: recommendationId },
        data: { isApplied: true },
    });

    return updated;
};
const dismissRecommendation = async (recommendationId: string, userId: string) => {
    const recommendation = await prisma.aIRecommendation.findUnique({
        where: { id: recommendationId },
    });

    if (!recommendation) {
        throw new ApiError(404, "Recommendation not found");
    }

    if (recommendation.userId !== userId) {
        throw new ApiError(403, "Unauthorized");
    }

    await prisma.aIRecommendation.delete({
        where: { id: recommendationId },
    });

    return { message: "Recommendation dismissed" };
};

export const AIRecommendationService = {
    analyzeStudyPatterns,
    generateRecommendations,
    getUserRecommendations,
    applyRecommendation,
    dismissRecommendation,
};
