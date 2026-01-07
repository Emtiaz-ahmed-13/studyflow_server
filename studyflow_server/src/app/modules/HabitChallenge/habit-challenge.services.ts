import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICreateHabitChallenge, IUpdateHabitChallenge } from "./habit-challenge.interface";

const createChallenge = async (userId: string, data: ICreateHabitChallenge) => {
    // Check if there's already an active challenge of same type
    const activeChallenge = await prisma.habitChallenge.findFirst({
        where: {
            userId,
            type: data.type,
            isCompleted: false,
        },
    });

    if (activeChallenge) {
        throw new ApiError(400, "You already have an active challenge of this type");
    }

    const startDate = data.startDate ? new Date(data.startDate) : new Date();

    const result = await prisma.habitChallenge.create({
        data: {
            ...data,
            userId,
            startDate,
            endDate: new Date(startDate.getTime() + data.targetDuration * 24 * 60 * 60 * 1000),
            progress: 0,
            currentStreak: 0,
            longestStreak: 0,
            checkIns: [],
            isCompleted: false,
        },
    });
    return result;
};

const getMyChallenges = async (userId: string) => {
    const result = await prisma.habitChallenge.findMany({
        where: { userId },
        orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }],
    });
    return result;
};

const getChallengeById = async (id: string, userId: string) => {
    const result = await prisma.habitChallenge.findUnique({
        where: { id },
    });

    if (!result) {
        throw new ApiError(404, "Habit challenge not found");
    }

    if (result.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    return result;
};

const checkIn = async (id: string, userId: string) => {
    const challenge = await prisma.habitChallenge.findUnique({
        where: { id },
    });

    if (!challenge) {
        throw new ApiError(404, "Habit challenge not found");
    }

    if (challenge.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    if (challenge.isCompleted) {
        throw new ApiError(400, "Challenge already completed");
    }

    const today = new Date().toISOString().split("T")[0];
    const checkIns = (challenge.checkIns as string[]) || [];

    if (checkIns.includes(today)) {
        throw new ApiError(400, "Already checked in today");
    }

    // Check streak logic
    let currentStreak = challenge.currentStreak;
    const lastCheckIn = checkIns.length > 0 ? checkIns[checkIns.length - 1] : null;

    if (lastCheckIn) {
        const lastDate = new Date(lastCheckIn);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            currentStreak += 1;
        } else if (diffDays > 1) {
            currentStreak = 1; // Streak broken
        }
    } else {
        currentStreak = 1;
    }

    checkIns.push(today);
    const progress = checkIns.length;
    const isCompleted = progress >= challenge.targetDuration;

    const result = await prisma.habitChallenge.update({
        where: { id },
        data: {
            checkIns,
            progress,
            currentStreak,
            longestStreak: Math.max(currentStreak, challenge.longestStreak),
            isCompleted,
        },
    });

    return result;
};

const updateChallenge = async (id: string, userId: string, payload: IUpdateHabitChallenge) => {
    const isExist = await prisma.habitChallenge.findUnique({
        where: { id },
    });

    if (!isExist) {
        throw new ApiError(404, "Habit challenge not found");
    }

    if (isExist.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    const result = await prisma.habitChallenge.update({
        where: { id },
        data: payload,
    });
    return result;
};

const deleteChallenge = async (id: string, userId: string) => {
    const isExist = await prisma.habitChallenge.findUnique({
        where: { id },
    });

    if (!isExist) {
        throw new ApiError(404, "Habit challenge not found");
    }

    if (isExist.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    const result = await prisma.habitChallenge.delete({
        where: { id },
    });
    return result;
};

export const HabitChallengeService = {
    createChallenge,
    getMyChallenges,
    getChallengeById,
    checkIn,
    updateChallenge,
    deleteChallenge,
};
