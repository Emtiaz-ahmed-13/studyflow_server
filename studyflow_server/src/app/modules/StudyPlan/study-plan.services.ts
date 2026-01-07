import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICreateStudyPlan, IStudyPlanFilters, IUpdateStudyPlan } from "./study-plan.interface";

const createStudyPlan = async (userId: string, data: ICreateStudyPlan) => {
    if (data.subjectId) {
        const subject = await prisma.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
    }

    const studyPlan = await prisma.studyPlan.create({
        data: {
            ...data,
            userId,
        },
        include: {
            subject: true,
            tasks: true,
        },
    });

    return studyPlan;
};

const getStudyPlans = async (filters: IStudyPlanFilters) => {
    const { userId, subjectId, active, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const whereConditions: any = { userId };

    if (subjectId) {
        whereConditions.subjectId = subjectId;
    }

    if (active) {
        whereConditions.OR = [
            { endDate: { gte: new Date() } },
            { endDate: null },
        ];
    }

    const [studyPlans, total] = await Promise.all([
        prisma.studyPlan.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                subject: true,
                tasks: {
                    orderBy: { deadline: "asc" },
                },
            },
            orderBy: { startDate: "desc" },
        }),
        prisma.studyPlan.count({ where: whereConditions }),
    ]);

    return {
        data: studyPlans,
        meta: { page, limit, total },
    };
};

const getStudyPlanById = async (id: string, userId: string) => {
    const studyPlan = await prisma.studyPlan.findFirst({
        where: { id, userId },
        include: {
            subject: true,
            tasks: {
                orderBy: { deadline: "asc" },
            },
        },
    });

    if (!studyPlan) {
        throw new ApiError(404, "Study plan not found");
    }

    return studyPlan;
};

const updateStudyPlan = async (id: string, userId: string, data: IUpdateStudyPlan) => {
    const existing = await prisma.studyPlan.findFirst({
        where: { id, userId },
    });

    if (!existing) {
        throw new ApiError(404, "Study plan not found");
    }

    if (data.subjectId) {
        const subject = await prisma.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
    }

    const updated = await prisma.studyPlan.update({
        where: { id },
        data,
        include: {
            subject: true,
            tasks: true,
        },
    });

    return updated;
};

const deleteStudyPlan = async (id: string, userId: string) => {
    const existing = await prisma.studyPlan.findFirst({
        where: { id, userId },
    });

    if (!existing) {
        throw new ApiError(404, "Study plan not found");
    }

    await prisma.studyPlan.delete({ where: { id } });

    return { message: "Study plan deleted successfully" };
};

export const StudyPlanService = {
    createStudyPlan,
    getStudyPlans,
    getStudyPlanById,
    updateStudyPlan,
    deleteStudyPlan,
};
