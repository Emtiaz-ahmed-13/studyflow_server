import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICreateDailyRoutine, IUpdateDailyRoutine } from "./daily-routine.interface";

const createRoutine = async (userId: string, data: ICreateDailyRoutine) => {
    // If setting as active, deactivate others (logic optional, here assuming multiple active routines allowed or handled by frontend)
    // Let's implement single active routine policy for simplicity

    // Check if user has routines
    const existingRoutine = await prisma.dailyRoutine.findFirst({
        where: { userId, isActive: true },
    });

    const result = await prisma.dailyRoutine.create({
        data: {
            ...data,
            userId,
            isActive: !existingRoutine, // If no active routine, make this one active
            activities: data.activities as any,
        },
    });

    return result;
};

const getMyRoutines = async (userId: string) => {
    const result = await prisma.dailyRoutine.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

const getRoutineById = async (id: string, userId: string) => {
    const result = await prisma.dailyRoutine.findUnique({
        where: { id },
    });

    if (!result) {
        throw new ApiError(404, "Routine not found");
    }

    if (result.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    return result;
};

const updateRoutine = async (id: string, userId: string, payload: IUpdateDailyRoutine) => {
    const isExist = await prisma.dailyRoutine.findUnique({
        where: { id },
    });

    if (!isExist) {
        throw new ApiError(404, "Routine not found");
    }

    if (isExist.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    // If setting to active, deactivate others
    if (payload.isActive) {
        await prisma.dailyRoutine.updateMany({
            where: { userId, id: { not: id } },
            data: { isActive: false },
        });
    }

    const result = await prisma.dailyRoutine.update({
        where: { id },
        data: {
            ...payload,
            activities: payload.activities ? (payload.activities as any) : undefined,
        },
    });

    return result;
};

const deleteRoutine = async (id: string, userId: string) => {
    const isExist = await prisma.dailyRoutine.findUnique({
        where: { id },
    });

    if (!isExist) {
        throw new ApiError(404, "Routine not found");
    }

    if (isExist.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    const result = await prisma.dailyRoutine.delete({
        where: { id },
    });
    return result;
};

const aiGenerateRoutine = async (userId: string) => {
    // This would integrate with Gemini to generate a routine
    // For now, returning a template
    return {
        message: "This endpoint will trigger AI generation",
        template: {
            name: "Suggested Balanced Routine",
            activities: [
                { slot: "MORNING_MEDITATION", time: "07:00", duration: 15 },
                { slot: "STUDY_SESSION", time: "09:00", duration: 90 },
                { slot: "BREAK_EXERCISE", time: "10:30", duration: 15 },
                { slot: "STUDY_SESSION", time: "10:45", duration: 90 },
                { slot: "END_DAY_RECALL", time: "20:00", duration: 20 },
                { slot: "BEDTIME_MEDITATION", time: "22:00", duration: 10 },
            ]
        }
    };
};

export const DailyRoutineService = {
    createRoutine,
    getMyRoutines,
    getRoutineById,
    updateRoutine,
    deleteRoutine,
    aiGenerateRoutine,
};
