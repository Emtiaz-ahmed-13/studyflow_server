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
exports.StudyTechniqueService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createTechnique = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Verify subject if provided
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findUnique({
            where: { id: data.subjectId },
        });
        if (!subject) {
            throw new ApiError_1.default(404, "Subject not found");
        }
    }
    const result = yield prisma_1.default.studyTechnique.create({
        data: Object.assign(Object.assign({}, data), { userId }),
    });
    return result;
});
const getAllTechniques = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.studyTechnique.findMany({
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
});
const getTechniqueById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.studyTechnique.findUnique({
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
        throw new ApiError_1.default(404, "Study technique session not found");
    }
    if (result.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    return result;
});
const updateTechnique = (id, userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.studyTechnique.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(404, "Study technique session not found");
    }
    if (isExist.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    const result = yield prisma_1.default.studyTechnique.update({
        where: { id },
        data: payload,
    });
    return result;
});
const deleteTechnique = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.studyTechnique.findUnique({
        where: { id },
    });
    if (!isExist) {
        throw new ApiError_1.default(404, "Study technique session not found");
    }
    if (isExist.userId !== userId) {
        throw new ApiError_1.default(403, "Unauthorized access");
    }
    const result = yield prisma_1.default.studyTechnique.delete({
        where: { id },
    });
    return result;
});
const getAnalytics = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get total techniques used
    const techniques = yield prisma_1.default.studyTechnique.findMany({
        where: { userId },
        select: {
            type: true,
            duration: true,
            effectiveness: true,
        },
    });
    // Calculate effectiveness per type
    const effectivenessByType = {};
    techniques.forEach(tech => {
        if (!effectivenessByType[tech.type]) {
            effectivenessByType[tech.type] = { count: 0, totalEffectiveness: 0, totalDuration: 0 };
        }
        effectivenessByType[tech.type].count += 1;
        effectivenessByType[tech.type].totalDuration += tech.duration;
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
});
exports.StudyTechniqueService = {
    createTechnique,
    getAllTechniques,
    getTechniqueById,
    updateTechnique,
    deleteTechnique,
    getAnalytics,
};
