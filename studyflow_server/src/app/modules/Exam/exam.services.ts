import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { ICreateExam, ICreateQuestion, IExamFilters, IUpdateExam } from "./exam.interface";

const createExam = async (userId: string, data: ICreateExam) => {
    if (data.subjectId) {
        const subject = await prisma.subject.findFirst({ where: { id: data.subjectId, userId } });
        if (!subject) throw new ApiError(404, "Subject not found");
    }
    return await prisma.exam.create({
        data: { ...data, userId },
        include: { subject: true, questions: true },
    });
};

const getExams = async (filters: IExamFilters) => {
    const { userId, subjectId, upcoming, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const whereConditions: any = { userId };
    if (subjectId) whereConditions.subjectId = subjectId;
    if (upcoming) whereConditions.examDate = { gte: new Date() };

    const [exams, total] = await Promise.all([
        prisma.exam.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: { subject: true, questions: true },
            orderBy: { examDate: "asc" },
        }),
        prisma.exam.count({ where: whereConditions }),
    ]);
    return { data: exams, meta: { page, limit, total } };
};

const getExamById = async (id: string, userId: string) => {
    const exam = await prisma.exam.findFirst({
        where: { id, userId },
        include: { subject: true, questions: { include: { answers: true } } },
    });
    if (!exam) throw new ApiError(404, "Exam not found");
    return exam;
};

const updateExam = async (id: string, userId: string, data: IUpdateExam) => {
    const existing = await prisma.exam.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Exam not found");
    if (data.subjectId) {
        const subject = await prisma.subject.findFirst({ where: { id: data.subjectId, userId } });
        if (!subject) throw new ApiError(404, "Subject not found");
    }
    return await prisma.exam.update({ where: { id }, data, include: { subject: true, questions: true } });
};

const deleteExam = async (id: string, userId: string) => {
    const existing = await prisma.exam.findFirst({ where: { id, userId } });
    if (!existing) throw new ApiError(404, "Exam not found");
    await prisma.exam.delete({ where: { id } });
    return { message: "Exam deleted successfully" };
};

const createQuestion = async (userId: string, data: ICreateQuestion) => {
    const exam = await prisma.exam.findFirst({ where: { id: data.examId, userId } });
    if (!exam) throw new ApiError(404, "Exam not found");
    return await prisma.question.create({ data, include: { exam: true } });
};

export const ExamService = {
    createExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam,
    createQuestion,
};
