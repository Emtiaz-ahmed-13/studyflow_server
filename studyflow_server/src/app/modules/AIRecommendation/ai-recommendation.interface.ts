export interface IAIRecommendation {
    id: string;
    userId: string;
    type: RecommendationType;
    title: string;
    description: string;
    priority: number;
    metadata?: Record<string, any>;
    isApplied: boolean;
    createdAt: Date;
}

export enum RecommendationType {
    STUDY_TIME = "STUDY_TIME",
    FOCUS_DURATION = "FOCUS_DURATION",
    SUBJECT_PRIORITY = "SUBJECT_PRIORITY",
    BREAK_REMINDER = "BREAK_REMINDER",
    WORKLOAD_ADJUSTMENT = "WORKLOAD_ADJUSTMENT",
}

export interface IStudyPattern {
    userId: string;
    totalStudyTime: number;
    averageSessionDuration: number;
    averageProductivity: number;
    preferredStudyHours: number[];
    weakSubjects: string[];
    strongSubjects: string[];
    streakData: {
        current: number;
        longest: number;
    };
    wellnessMetrics: {
        averageStress: number;
        averageFocus: number;
    };
    techniqueEffectiveness: Record<string, number>;
    correlatedWeaknesses: string[];
}
