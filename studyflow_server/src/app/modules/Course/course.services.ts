import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICourseFilters, ICreateCourse, IUpdateCourse } from "./course.interface";

/**
 * Create a new course
 */
const createCourse = async (userId: string, data: ICreateCourse) => {
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

    const course = await prisma.course.create({
        data: {
            ...data,
            userId,
        },
        include: {
            subject: true,
        },
    });

    return course;
};

/**
 * Get all courses for a user with filtering and pagination
 */
const getCourses = async (filters: ICourseFilters) => {
    const { userId, subjectId, semester, year, searchTerm, page = 1, limit = 20 } = filters;

    const skip = (page - 1) * limit;

    const whereConditions: any = {
        userId,
    };

    // Add filters
    if (subjectId) {
        whereConditions.subjectId = subjectId;
    }

    if (semester) {
        whereConditions.semester = semester;
    }

    if (year) {
        whereConditions.year = year;
    }

    // Add search functionality
    if (searchTerm) {
        whereConditions.OR = [
            { name: { contains: searchTerm, mode: "insensitive" } },
            { instructor: { contains: searchTerm, mode: "insensitive" } },
        ];
    }

    const [courses, total] = await Promise.all([
        prisma.course.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                subject: true,
            },
            orderBy: [
                { year: "desc" },
                { semester: "desc" },
                { createdAt: "desc" },
            ],
        }),
        prisma.course.count({
            where: whereConditions,
        }),
    ]);

    return {
        data: courses,
        meta: {
            page,
            limit,
            total,
        },
    };
};

/**
 * Get a single course by ID
 */
const getCourseById = async (id: string, userId: string) => {
    const course = await prisma.course.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            subject: true,
        },
    });

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return course;
};

/**
 * Update a course
 */
const updateCourse = async (id: string, userId: string, data: IUpdateCourse) => {
    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!existingCourse) {
        throw new ApiError(404, "Course not found");
    }

    // If updating subjectId, verify it belongs to user
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

    const updatedCourse = await prisma.course.update({
        where: {
            id,
        },
        data,
        include: {
            subject: true,
        },
    });

    return updatedCourse;
};

/**
 * Delete a course
 */
const deleteCourse = async (id: string, userId: string) => {
    // Check if course exists and belongs to user
    const existingCourse = await prisma.course.findFirst({
        where: {
            id,
            userId,
        },
    });

    if (!existingCourse) {
        throw new ApiError(404, "Course not found");
    }

    await prisma.course.delete({
        where: {
            id,
        },
    });

    return {
        message: "Course deleted successfully",
    };
};

export const CourseService = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};
