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
exports.SubjectService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
/**
 * Create a new subject
 */
const createSubject = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = yield prisma_1.default.subject.create({
        data: Object.assign(Object.assign({}, data), { userId }),
    });
    return subject;
});
/**
 * Get all subjects for a user with pagination
 */
const getSubjects = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, searchTerm, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = {
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
    const [subjects, total] = yield Promise.all([
        prisma_1.default.subject.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        }),
        prisma_1.default.subject.count({
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
});
/**
 * Get a single subject by ID
 */
const getSubjectById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = yield prisma_1.default.subject.findFirst({
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
        throw new ApiError_1.default(404, "Subject not found");
    }
    return subject;
});
/**
 * Update a subject
 */
const updateSubject = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if subject exists and belongs to user
    const existingSubject = yield prisma_1.default.subject.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingSubject) {
        throw new ApiError_1.default(404, "Subject not found");
    }
    const updatedSubject = yield prisma_1.default.subject.update({
        where: {
            id,
        },
        data,
    });
    return updatedSubject;
});
/**
 * Delete a subject
 */
const deleteSubject = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if subject exists and belongs to user
    const existingSubject = yield prisma_1.default.subject.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingSubject) {
        throw new ApiError_1.default(404, "Subject not found");
    }
    yield prisma_1.default.subject.delete({
        where: {
            id,
        },
    });
    return {
        message: "Subject deleted successfully",
    };
});
exports.SubjectService = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
