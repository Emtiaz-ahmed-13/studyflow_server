"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
/**
 * Create a new course
 */
const createCourse = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify that the subject belongs to the user
    const subject = yield prisma_1.default.subject.findFirst({
        where: {
            id: data.subjectId,
            userId,
        },
    });
    if (!subject) {
        throw new ApiError_1.default(404, "Subject not found");
    }
    const course = yield prisma_1.default.course.create({
        data: Object.assign(Object.assign({}, data), { userId }),
        include: {
            subject: true,
        },
    });
    return course;
});
/**
 * Get all courses for a user with filtering and pagination
 */
const getCourses = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, subjectId, semester, year, searchTerm, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = {
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
    const [courses, total] = yield Promise.all([
        prisma_1.default.course.findMany({
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
        prisma_1.default.course.count({
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
});
/**
 * Get a single course by ID
 */
const getCourseById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma_1.default.course.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            subject: true,
        },
    });
    if (!course) {
        throw new ApiError_1.default(404, "Course not found");
    }
    return course;
});
/**
 * Update a course
 */
const updateCourse = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if course exists and belongs to user
    const existingCourse = yield prisma_1.default.course.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingCourse) {
        throw new ApiError_1.default(404, "Course not found");
    }
    // If updating subjectId, verify it belongs to user
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findFirst({
            where: {
                id: data.subjectId,
                userId,
            },
        });
        if (!subject) {
            throw new ApiError_1.default(404, "Subject not found");
        }
    }
    const updatedCourse = yield prisma_1.default.course.update({
        where: {
            id,
        },
        data,
        include: {
            subject: true,
        },
    });
    return updatedCourse;
});
/**
 * Delete a course
 */
const deleteCourse = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if course exists and belongs to user
    const existingCourse = yield prisma_1.default.course.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingCourse) {
        throw new ApiError_1.default(404, "Course not found");
    }
    yield prisma_1.default.course.delete({
        where: {
            id,
        },
    });
    return {
        message: "Course deleted successfully",
    };
});
exports.CourseService = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};
