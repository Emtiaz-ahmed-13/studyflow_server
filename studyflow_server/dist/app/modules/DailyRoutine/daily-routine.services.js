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
exports.DailyRoutineService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createRoutine = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // If setting as active, deactivate others (logic optional, here assuming multiple active routines allowed or handled by frontend)
    // Let's implement single active routine policy for simplicity
    // Check if user has routines
    const existingRoutine = yield prisma_1.default.dailyRoutine.findFirst({
        where: { userId, isActive: true },
    });
    const result = yield prisma_1.default.dailyRoutine.create({
        data: Object.assign(Object.assign({}, data), { userId, isActive: !existingRoutine, activities: data.activities }),
    });
    return result;
});
const getMyRoutines = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.dailyRoutine.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const getRoutineById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.dailyRoutine.findUnique({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(404, "Routine not found");
    }
    if (result.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    return result;
});
const updateRoutine = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.dailyRoutine.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(404, "Routine not found");
    }
    if (isExist.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    // If setting to active, deactivate others
    if (payload.isActive) {
        yield prisma_1.default.dailyRoutine.updateMany({
            where: { userId, id: { not: id } },
            data: { isActive: false },
        });
    }
    const result = yield prisma_1.default.dailyRoutine.update({
        where: { id },
        data: Object.assign(Object.assign({}, payload), { activities: payload.activities ? payload.activities : undefined }),
    });
    return result;
});
const deleteRoutine = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.dailyRoutine.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(404, "Routine not found");
    }
    if (isExist.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    const result = yield prisma_1.default.dailyRoutine.delete({
        where: { id },
    });
    return result;
});
const aiGenerateRoutine = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // This would integrate with Gemini to generate a routine
    // For now, returning a template
    return {
        message: "This endpoint will trigger AI generation",
        template: {
            name: "Suggested Balanced Routine",
            activities: [
                { slot: "MORNING_MEDITATION", time: "07:00", duration: 15 },
                { slot: "STUDY_SESSION", time: "09:00", duration: 90 },
                { slot: "BREAK_EXERCISE", time: "10:30", duration: 15 },
                { slot: "STUDY_SESSION", time: "10:45", duration: 90 },
                { slot: "END_DAY_RECALL", time: "20:00", duration: 20 },
                { slot: "BEDTIME_MEDITATION", time: "22:00", duration: 10 },
            ]
        }
    };
});
exports.DailyRoutineService = {
    createRoutine,
    getMyRoutines,
    getRoutineById,
    updateRoutine,
    deleteRoutine,
    aiGenerateRoutine,
};
