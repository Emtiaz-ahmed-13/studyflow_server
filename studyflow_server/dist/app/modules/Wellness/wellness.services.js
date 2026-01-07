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
exports.WellnessService = void 0;
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createMeditation = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.meditationSession.create({
        data: Object.assign(Object.assign({}, data), { userId, completed: true }),
    });
    return result;
});
const getMeditationHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.meditationSession.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
    return result;
});
const createWellnessActivity = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wellnessActivity.create({
        data: Object.assign(Object.assign({}, data), { userId, date: data.date ? new Date(data.date) : new Date() }),
    });
    return result;
});
const getWellnessHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.wellnessActivity.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
    return result;
});
const getAnalytics = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get last 7 days metrics
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const meditations = yield prisma_1.default.meditationSession.findMany({
        where: {
            userId,
            createdAt: { gte: sevenDaysAgo },
        },
    });
    const totalMeditationMinutes = meditations.reduce((acc, curr) => acc + curr.duration, 0);
    const completedSessions = meditations.length;
    // Calculate stress reduction if available
    let totalStressReduction = 0;
    let sessionsWithStressData = 0;
    meditations.forEach(session => {
        if (session.stressLevelBefore && session.stressLevelAfter) {
            totalStressReduction += (session.stressLevelBefore - session.stressLevelAfter);
            sessionsWithStressData++;
        }
    });
    const averageStressReduction = sessionsWithStressData > 0
        ? totalStressReduction / sessionsWithStressData
        : 0;
    return {
        totalMeditationMinutes,
        completedSessions,
        averageStressReduction,
        sessionsWithStressData,
    };
});
exports.WellnessService = {
    createMeditation,
    getMeditationHistory,
    createWellnessActivity,
    getWellnessHistory,
    getAnalytics,
};
