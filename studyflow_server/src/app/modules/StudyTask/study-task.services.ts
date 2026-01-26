import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { GamificationServices } from "../Gamification/gamification.services";
import { ICreateStudyTask, IStudyTaskFilters, IUpdateStudyTask } from "./study-task.interface";

const createStudyTask = async (userId: string, data: ICreateStudyTask) => {
    const studyPlan = await prisma.studyPlan.findFirst({
        where: { id: data.studyPlanId, userId },
    });

    if (!studyPlan) {
        throw new ApiError(404, "Study plan not found");
    }

    const task = await prisma.studyTask.create({
        data,
        include: { studyPlan: true },
    });

    return task;
};

const getStudyTasks = async (filters: IStudyTaskFilters) => {
    const { userId, studyPlanId, completed, priority, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const whereConditions: any = {
        studyPlan: { userId },
    };

    if (studyPlanId) {
        whereConditions.studyPlanId = studyPlanId;
    }

    if (completed !== undefined) {
        whereConditions.completed = completed;
    }

    if (priority !== undefined) {
        whereConditions.priority = priority;
    }

    const [tasks, total] = await Promise.all([
        prisma.studyTask.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { studyPlan: true },
            orderBy: [
                { completed: "asc" },
                { priority: "desc" },
                { deadline: "asc" },
            ],
        }),
        prisma.studyTask.count({ where: whereConditions }),
    ]);

    return {
        data: tasks,
        meta: { page, limit, total },
    };
};

const getStudyTaskById = async (id: string, userId: string) => {
    const task = await prisma.studyTask.findFirst({
        where: {
            id,
            studyPlan: { userId },
        },
        include: { studyPlan: true },
    });

    if (!task) {
        throw new ApiError(404, "Study task not found");
    }

    return task;
};

const updateStudyTask = async (id: string, userId: string, data: IUpdateStudyTask) => {
    const existing = await prisma.studyTask.findFirst({
        where: {
            id,
            studyPlan: { userId },
        },
    });

    if (!existing) {
        throw new ApiError(404, "Study task not found");
    }

    const updated = await prisma.studyTask.update({
        where: { id },
        data,
        include: { studyPlan: true },
    });

    // Award XP if task is marked complete for the first time
    if (data.completed === true && existing.completed === false) {
        await GamificationServices.addXp(userId, 20);
    }

    return updated;
};

const deleteStudyTask = async (id: string, userId: string) => {
    const existing = await prisma.studyTask.findFirst({
        where: {
            id,
            studyPlan: { userId },
        },
    });

    if (!existing) {
        throw new ApiError(404, "Study task not found");
    }

    await prisma.studyTask.delete({ where: { id } });

    return { message: "Study task deleted successfully" };
};

export const StudyTaskService = {
    createStudyTask,
    getStudyTasks,
    getStudyTaskById,
    updateStudyTask,
    deleteStudyTask,
};
