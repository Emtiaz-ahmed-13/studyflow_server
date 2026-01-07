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
exports.StudyTaskService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createStudyTask = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const studyPlan = yield prisma_1.default.studyPlan.findFirst({
        where: { id: data.studyPlanId, userId },
    });
    if (!studyPlan) {
        throw new ApiError_1.default(404, "Study plan not found");
    }
    const task = yield prisma_1.default.studyTask.create({
        data,
        include: { studyPlan: true },
    });
    return task;
});
const getStudyTasks = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, studyPlanId, completed, priority, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = {
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
    const [tasks, total] = yield Promise.all([
        prisma_1.default.studyTask.findMany({
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
        prisma_1.default.studyTask.count({ where: whereConditions }),
    ]);
    return {
        data: tasks,
        meta: { page, limit, total },
    };
});
const getStudyTaskById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield prisma_1.default.studyTask.findFirst({
        where: {
            id,
            studyPlan: { userId },
        },
        include: { studyPlan: true },
    });
    if (!task) {
        throw new ApiError_1.default(404, "Study task not found");
    }
    return task;
});
const updateStudyTask = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.studyTask.findFirst({
        where: {
            id,
            studyPlan: { userId },
        },
    });
    if (!existing) {
        throw new ApiError_1.default(404, "Study task not found");
    }
    const updated = yield prisma_1.default.studyTask.update({
        where: { id },
        data,
        include: { studyPlan: true },
    });
    return updated;
});
const deleteStudyTask = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.studyTask.findFirst({
        where: {
            id,
            studyPlan: { userId },
        },
    });
    if (!existing) {
        throw new ApiError_1.default(404, "Study task not found");
    }
    yield prisma_1.default.studyTask.delete({ where: { id } });
    return { message: "Study task deleted successfully" };
});
exports.StudyTaskService = {
    createStudyTask,
    getStudyTasks,
    getStudyTaskById,
    updateStudyTask,
    deleteStudyTask,
};
