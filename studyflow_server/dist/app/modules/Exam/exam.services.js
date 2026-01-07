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
exports.ExamService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const createExam = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findFirst({ where: { id: data.subjectId, userId } });
        if (!subject)
            throw new ApiError_1.default(404, "Subject not found");
    }
    return yield prisma_1.default.exam.create({
        data: Object.assign(Object.assign({}, data), { userId }),
        include: { subject: true, questions: true },
    });
});
const getExams = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, subjectId, upcoming, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions = { userId };
    if (subjectId)
        whereConditions.subjectId = subjectId;
    if (upcoming)
        whereConditions.examDate = { gte: new Date() };
    const [exams, total] = yield Promise.all([
        prisma_1.default.exam.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { subject: true, questions: true },
            orderBy: { examDate: "asc" },
        }),
        prisma_1.default.exam.count({ where: whereConditions }),
    ]);
    return { data: exams, meta: { page, limit, total } };
});
const getExamById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const exam = yield prisma_1.default.exam.findFirst({
        where: { id, userId },
        include: { subject: true, questions: { include: { answers: true } } },
    });
    if (!exam)
        throw new ApiError_1.default(404, "Exam not found");
    return exam;
});
const updateExam = (id, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.exam.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Exam not found");
    if (data.subjectId) {
        const subject = yield prisma_1.default.subject.findFirst({ where: { id: data.subjectId, userId } });
        if (!subject)
            throw new ApiError_1.default(404, "Subject not found");
    }
    return yield prisma_1.default.exam.update({ where: { id }, data, include: { subject: true, questions: true } });
});
const deleteExam = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield prisma_1.default.exam.findFirst({ where: { id, userId } });
    if (!existing)
        throw new ApiError_1.default(404, "Exam not found");
    yield prisma_1.default.exam.delete({ where: { id } });
    return { message: "Exam deleted successfully" };
});
const createQuestion = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const exam = yield prisma_1.default.exam.findFirst({ where: { id: data.examId, userId } });
    if (!exam)
        throw new ApiError_1.default(404, "Exam not found");
    return yield prisma_1.default.question.create({ data, include: { exam: true } });
});
exports.ExamService = {
    createExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam,
    createQuestion,
};
