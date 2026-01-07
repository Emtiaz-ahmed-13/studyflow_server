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
exports.HabitChallengeService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createChallenge = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if there's already an active challenge of same type
    const activeChallenge = yield prisma_1.default.habitChallenge.findFirst({
        where: {
            userId,
            type: data.type,
            isCompleted: false,
        },
    });
    if (activeChallenge) {
        throw new ApiError_1.default(400, "You already have an active challenge of this type");
    }
    const startDate = data.startDate ? new Date(data.startDate) : new Date();
    const result = yield prisma_1.default.habitChallenge.create({
        data: Object.assign(Object.assign({}, data), { userId,
            startDate, endDate: new Date(startDate.getTime() + data.targetDuration * 24 * 60 * 60 * 1000), progress: 0, currentStreak: 0, longestStreak: 0, checkIns: [], isCompleted: false }),
    });
    return result;
});
const getMyChallenges = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.habitChallenge.findMany({
        where: { userId },
        orderBy: [{ isCompleted: "asc" }, { createdAt: "desc" }],
    });
    return result;
});
const getChallengeById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.habitChallenge.findUnique({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(404, "Habit challenge not found");
    }
    if (result.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    return result;
});
const checkIn = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const challenge = yield prisma_1.default.habitChallenge.findUnique({
        where: { id },
    });
    if (!challenge) {
        throw new ApiError_1.default(404, "Habit challenge not found");
    }
    if (challenge.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    if (challenge.isCompleted) {
        throw new ApiError_1.default(400, "Challenge already completed");
    }
    const today = new Date().toISOString().split("T")[0];
    const checkIns = challenge.checkIns || [];
    if (checkIns.includes(today)) {
        throw new ApiError_1.default(400, "Already checked in today");
    }
    // Check streak logic
    let currentStreak = challenge.currentStreak;
    const lastCheckIn = checkIns.length > 0 ? checkIns[checkIns.length - 1] : null;
    if (lastCheckIn) {
        const lastDate = new Date(lastCheckIn);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            currentStreak += 1;
        }
        else if (diffDays > 1) {
            currentStreak = 1; // Streak broken
        }
    }
    else {
        currentStreak = 1;
    }
    checkIns.push(today);
    const progress = checkIns.length;
    const isCompleted = progress >= challenge.targetDuration;
    const result = yield prisma_1.default.habitChallenge.update({
        where: { id },
        data: {
            checkIns,
            progress,
            currentStreak,
            longestStreak: Math.max(currentStreak, challenge.longestStreak),
            isCompleted,
        },
    });
    return result;
});
const updateChallenge = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.habitChallenge.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(404, "Habit challenge not found");
    }
    if (isExist.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    const result = yield prisma_1.default.habitChallenge.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteChallenge = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.habitChallenge.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(404, "Habit challenge not found");
    }
    if (isExist.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    const result = yield prisma_1.default.habitChallenge.delete({
        where: { id },
    });
    return result;
});
exports.HabitChallengeService = {
    createChallenge,
    getMyChallenges,
    getChallengeById,
    checkIn,
    updateChallenge,
    deleteChallenge,
};
