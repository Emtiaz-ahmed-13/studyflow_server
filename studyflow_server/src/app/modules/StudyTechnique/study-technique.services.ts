import { StudyTechnique } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { GamificationServices } from "../Gamification/gamification.services";
import { ICreateStudyTechnique, IUpdateStudyTechnique } from "./study-technique.interface";

const createTechnique = async (userId: string, data: ICreateStudyTechnique): Promise<StudyTechnique> => {
    // Verify subject if provided
    if (data.subjectId) {
        const subject = await prisma.subject.findUnique({
            where: { id: data.subjectId },
        });
        if (!subject) {
            throw new ApiError(404, "Subject not found");
        }
    }

    const result = await prisma.studyTechnique.create({
        data: {
            ...data,
            userId,
        },
    });

    // Add XP for using a study technique
    await GamificationServices.addXp(userId, 50);

    return result;
};

const getAllTechniques = async (userId: string): Promise<StudyTechnique[]> => {
    const result = await prisma.studyTechnique.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            subject: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                },
            },
        },
    });
    return result;
};

const getTechniqueById = async (id: string, userId: string): Promise<StudyTechnique> => {
    const result = await prisma.studyTechnique.findUnique({
        where: { id },
        include: {
            subject: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                },
            },
        },
    });

    if (!result) {
        throw new ApiError(404, "Study technique session not found");
    }

    if (result.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    return result;
};

const updateTechnique = async (id: string, userId: string, payload: IUpdateStudyTechnique): Promise<StudyTechnique> => {
    const isExist = await prisma.studyTechnique.findUnique({
        where: { id },
    });

    if (!isExist) {
        throw new ApiError(404, "Study technique session not found");
    }

    if (isExist.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    const result = await prisma.studyTechnique.update({
        where: { id },
        data: payload,
    });

    return result;
};

const deleteTechnique = async (id: string, userId: string): Promise<StudyTechnique> => {
    const isExist = await prisma.studyTechnique.findUnique({
        where: { id },
    });

    if (!isExist) {
        throw new ApiError(404, "Study technique session not found");
    }

    if (isExist.userId !== userId) {
        throw new ApiError(403, "Unauthorized access");
    }

    const result = await prisma.studyTechnique.delete({
        where: { id },
    });

    return result;
};

const getAnalytics = async (userId: string) => {
    // Get total techniques used
    const techniques = await prisma.studyTechnique.findMany({
        where: { userId },
        select: {
            type: true,
            duration: true,
            effectiveness: true,
        },
    });

    // Calculate effectiveness per type
    const effectivenessByType: Record<string, { count: number; totalEffectiveness: number; totalDuration: number }> = {};

    techniques.forEach(tech => {
        if (!effectivenessByType[tech.type]) {
            effectivenessByType[tech.type] = { count: 0, totalEffectiveness: 0, totalDuration: 0 };
        }

        effectivenessByType[tech.type].count += 1;
        effectivenessByType[tech.type].totalDuration += (tech.duration || 0);

        if (tech.effectiveness) {
            effectivenessByType[tech.type].totalEffectiveness += tech.effectiveness;
        }
    });

    // Format stats
    const stats = Object.entries(effectivenessByType).map(([type, data]) => ({
        type,
        count: data.count,
        totalDuration: data.totalDuration,
        averageEffectiveness: data.count > 0 ? data.totalEffectiveness / data.count : 0,
    }));

    return stats;
};

export const StudyTechniqueService = {
    createTechnique,
    getAllTechniques,
    getTechniqueById,
    updateTechnique,
    deleteTechnique,
    getAnalytics,
};
