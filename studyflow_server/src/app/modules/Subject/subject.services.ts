import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICreateSubject, ISubjectFilters, IUpdateSubject } from "./subject.interface";

/**
 * Create a new subject
 */
const createSubject = async (userId: string, data: ICreateSubject) => {
    const subject = await prisma.subject.create({
        data: {
            ...data,
            userId,
        },
    });

    return subject;
};

/**
 * Get all subjects for a user with pagination
 */
const getSubjects = async (filters: ISubjectFilters) => {
    const { userId, searchTerm, page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;

    const whereConditions: any = {
        userId,
    };

    // Add search functionality
    if (searchTerm) {
        whereConditions.OR = [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { code: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
        ];
    }

    const [subjects, total] = await Promise.all([
        prisma.subject.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma.subject.count({
            where: whereConditions,
        }),
    ]);

    return {
        data: subjects,
        meta: {
            page,
            limit,
            total,
        },
    };
};

/**
 * Get a single subject by ID
 */
const getSubjectById = async (id: string, userId: string) => {
    const subject = await prisma.subject.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            courses: true,
            classSchedules: true,
            studyPlans: true,
            notes: true,
            exams: true,
        },
    });

    if (!subject) {
        throw new ApiError(404, "Subject not found");
    }

    return subject;
};

/**
 * Update a subject
 */
const updateSubject = async (id: string, userId: string, data: IUpdateSubject) => {
    // Check if subject exists and belongs to user
    const existingSubject = await prisma.subject.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!existingSubject) {
        throw new ApiError(404, "Subject not found");
    }

    const updatedSubject = await prisma.subject.update({
        where: {
            id,
        },
        data,
    });

    return updatedSubject;
};

/**
 * Delete a subject
 */
const deleteSubject = async (id: string, userId: string) => {
    // Check if subject exists and belongs to user
    const existingSubject = await prisma.subject.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!existingSubject) {
        throw new ApiError(404, "Subject not found");
    }

    await prisma.subject.delete({
        where: {
            id,
        },
    });

    return {
        message: "Subject deleted successfully",
    };
};

export const SubjectService = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
