import prisma from "../../shared/prisma";
import { ICreateMeditation, ICreateWellnessActivity } from "./wellness.interface";

const createMeditation = async (userId: string, data: ICreateMeditation) => {
    const result = await prisma.meditationSession.create({
        data: {
            ...data,
            userId,
            completed: true,
        },
    });
    return result;
};

const getMeditationHistory = async (userId: string) => {
    const result = await prisma.meditationSession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

const createWellnessActivity = async (userId: string, data: ICreateWellnessActivity) => {
    const result = await prisma.wellnessActivity.create({
        data: {
            ...data,
            userId,
            date: data.date ? new Date(data.date) : new Date(),
        },
    });
    return result;
};

const getWellnessHistory = async (userId: string) => {
    const result = await prisma.wellnessActivity.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
    return result;
};

const getAnalytics = async (userId: string) => {
    // Get last 7 days metrics
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const meditations = await prisma.meditationSession.findMany({
        where: {
            userId,
            createdAt: { gte: sevenDaysAgo },
        },
    });

    const totalMeditationMinutes = meditations.reduce((acc, curr) => acc + curr.duration, 0);
    const completedSessions = meditations.length;

    // Calculate stress reduction if available
    let totalStressReduction = 0;
    let sessionsWithStressData = 0;

    meditations.forEach(session => {
        if (session.stressLevelBefore && session.stressLevelAfter) {
            totalStressReduction += (session.stressLevelBefore - session.stressLevelAfter);
            sessionsWithStressData++;
        }
    });

    const averageStressReduction = sessionsWithStressData > 0
        ? totalStressReduction / sessionsWithStressData
        : 0;

    return {
        totalMeditationMinutes,
        completedSessions,
        averageStressReduction,
        sessionsWithStressData,
    };
};

export const WellnessService = {
    createMeditation,
    getMeditationHistory,
    createWellnessActivity,
    getWellnessHistory,
    getAnalytics,
};
