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
exports.StudyPlanService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createStudyPlan = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError_1.default(404, "Subject not found");
        }
    }
    const studyPlan = yield prisma_1.default.studyPlan.create({
        data: Object.assign(Object.assign({}, data), { userId }),
        include: {
            subject: true,
            tasks: true,
        },
    });
    return studyPlan;
});
const getStudyPlans = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, subjectId, active, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = { userId };
    if (subjectId) {
        whereConditions.subjectId = subjectId;
    }
    if (active) {
        whereConditions.OR = [
            { endDate: { gte: new Date() } },
            { endDate: null },
        ];
    }
    const [studyPlans, total] = yield Promise.all([
        prisma_1.default.studyPlan.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                subject: true,
                tasks: {
                    orderBy: { deadline: "asc" },
                },
            },
            orderBy: { startDate: "desc" },
        }),
        prisma_1.default.studyPlan.count({ where: whereConditions }),
    ]);
    return {
        data: studyPlans,
        meta: { page, limit, total },
    };
});
const getStudyPlanById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const studyPlan = yield prisma_1.default.studyPlan.findFirst({
        where: { id, userId },
        include: {
            subject: true,
            tasks: {
                orderBy: { deadline: "asc" },
            },
        },
    });
    if (!studyPlan) {
        throw new ApiError_1.default(404, "Study plan not found");
    }
    return studyPlan;
});
const updateStudyPlan = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.studyPlan.findFirst({
        where: { id, userId },
    });
    if (!existing) {
        throw new ApiError_1.default(404, "Study plan not found");
    }
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findFirst({
            where: { id: data.subjectId, userId },
        });
        if (!subject) {
            throw new ApiError_1.default(404, "Subject not found");
        }
    }
    const updated = yield prisma_1.default.studyPlan.update({
        where: { id },
        data,
        include: {
            subject: true,
            tasks: true,
        },
    });
    return updated;
});
const deleteStudyPlan = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.studyPlan.findFirst({
        where: { id, userId },
    });
    if (!existing) {
        throw new ApiError_1.default(404, "Study plan not found");
    }
    yield prisma_1.default.studyPlan.delete({ where: { id } });
    return { message: "Study plan deleted successfully" };
});
exports.StudyPlanService = {
    createStudyPlan,
    getStudyPlans,
    getStudyPlanById,
    updateStudyPlan,
    deleteStudyPlan,
};
