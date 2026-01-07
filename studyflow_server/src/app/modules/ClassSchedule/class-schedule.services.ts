import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { IClassScheduleFilters, ICreateClassSchedule, IUpdateClassSchedule } from "./class-schedule.interface";

/**
 * Create a new class schedule
 */
const createClassSchedule = async (userId: string, data: ICreateClassSchedule) => {
    // Verify that the subject belongs to the user
    const subject = await prisma.subject.findFirst({
        where: {
            id: data.subjectId,
            userId,
        },
    });

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    const classSchedule = await prisma.classSchedule.create({
        data: {
            ...data,
            userId,
        },
        include: {
            subject: true,
        },
    });

    return classSchedule;
};

/**
 * Get all class schedules for a user with filtering and pagination
 */
const getClassSchedules = async (filters: IClassScheduleFilters) => {
    const { userId, subjectId, dayOfWeek, page = 1, limit = 50 } = filters;

    const skip = (page - 1) * limit;

    const whereConditions: any = {
        userId,
    };

    if (subjectId) {
        whereConditions.subjectId = subjectId;
    }

    if (dayOfWeek !== undefined) {
        whereConditions.dayOfWeek = dayOfWeek;
    }

    const [classSchedules, total] = await Promise.all([
        prisma.classSchedule.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                subject: true,
            },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" },
            ],
        }),
        prisma.classSchedule.count({
            where: whereConditions,
        }),
    ]);

    return {
        data: classSchedules,
        meta: {
            page,
            limit,
            total,
        },
    };
};

/**
 * Get a single class schedule by ID
 */
const getClassScheduleById = async (id: string, userId: string) => {
    const classSchedule = await prisma.classSchedule.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            subject: true,
        },
    });

    if (!classSchedule) {
        throw new ApiError(404, "Class schedule not found");
    }

    return classSchedule;
};

/**
 * Update a class schedule
 */
const updateClassSchedule = async (id: string, userId: string, data: IUpdateClassSchedule) => {
    const existingSchedule = await prisma.classSchedule.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!existingSchedule) {
        throw new ApiError(404, "Class schedule not found");
    }

    if (data.subjectId) {
        const subject = await prisma.subject.findFirst({
            where: {
                id: data.subjectId,
                userId,
            },
        });

        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
    }

    const updatedSchedule = await prisma.classSchedule.update({
        where: {
            id,
        },
        data,
        include: {
            subject: true,
        },
    });

    return updatedSchedule;
};

/**
 * Delete a class schedule
 */
const deleteClassSchedule = async (id: string, userId: string) => {
    const existingSchedule = await prisma.classSchedule.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!existingSchedule) {
        throw new ApiError(404, "Class schedule not found");
    }

    await prisma.classSchedule.delete({
        where: {
            id,
        },
    });

    return {
        message: "Class schedule deleted successfully",
    };
};

export const ClassScheduleService = {
    createClassSchedule,
    getClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule,
};
