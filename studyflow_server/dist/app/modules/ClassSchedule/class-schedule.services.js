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
exports.ClassScheduleService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
/**
 * Create a new class schedule
 */
const createClassSchedule = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
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
    const classSchedule = yield prisma_1.default.classSchedule.create({
        data: Object.assign(Object.assign({}, data), { userId }),
        include: {
            subject: true,
        },
    });
    return classSchedule;
});
/**
 * Get all class schedules for a user with filtering and pagination
 */
const getClassSchedules = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, subjectId, dayOfWeek, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = {
        userId,
    };
    if (subjectId) {
        whereConditions.subjectId = subjectId;
    }
    if (dayOfWeek !== undefined) {
        whereConditions.dayOfWeek = dayOfWeek;
    }
    const [classSchedules, total] = yield Promise.all([
        prisma_1.default.classSchedule.findMany({
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
        prisma_1.default.classSchedule.count({
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
});
/**
 * Get a single class schedule by ID
 */
const getClassScheduleById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const classSchedule = yield prisma_1.default.classSchedule.findFirst({
        where: {
            id,
            userId,
        },
        include: {
            subject: true,
        },
    });
    if (!classSchedule) {
        throw new ApiError_1.default(404, "Class schedule not found");
    }
    return classSchedule;
});
/**
 * Update a class schedule
 */
const updateClassSchedule = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSchedule = yield prisma_1.default.classSchedule.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingSchedule) {
        throw new ApiError_1.default(404, "Class schedule not found");
    }
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
    const updatedSchedule = yield prisma_1.default.classSchedule.update({
        where: {
            id,
        },
        data,
        include: {
            subject: true,
        },
    });
    return updatedSchedule;
});
/**
 * Delete a class schedule
 */
const deleteClassSchedule = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingSchedule = yield prisma_1.default.classSchedule.findFirst({
        where: {
            id,
            userId,
        },
    });
    if (!existingSchedule) {
        throw new ApiError_1.default(404, "Class schedule not found");
    }
    yield prisma_1.default.classSchedule.delete({
        where: {
            id,
        },
    });
    return {
        message: "Class schedule deleted successfully",
    };
});
exports.ClassScheduleService = {
    createClassSchedule,
    getClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule,
};
