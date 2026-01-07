import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ExamService } from "./exam.services";

const createExam = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ExamService.createExam(req.user?.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Exam created successfully", data: result });
});

const getMyExams = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { subjectId, upcoming, page, limit } = req.query;
    const result = await ExamService.getExams({
        userId: req.user?.userId,
        subjectId: subjectId as string,
        upcoming: upcoming === "true",
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });
    sendResponse(res, { statusCode: 200, success: true, message: "Exams retrieved successfully", data: result.data, meta: result.meta });
});

const getExamById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ExamService.getExamById(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: "Exam retrieved successfully", data: result });
});

const updateExam = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ExamService.updateExam(req.params.id, req.user?.userId, req.body);
    sendResponse(res, { statusCode: 200, success: true, message: "Exam updated successfully", data: result });
});

const deleteExam = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ExamService.deleteExam(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: result.message, data: null });
});

const createQuestion = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ExamService.createQuestion(req.user?.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Question created successfully", data: result });
});

export const ExamController = {
    createExam,
    getMyExams,
    getExamById,
    updateExam,
    deleteExam,
    createQuestion,
};
