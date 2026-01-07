import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StudyTaskService } from "./study-task.services";

const createStudyTask = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyTaskService.createStudyTask(req.user?.userId, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Study task created successfully",
        data: result,
    });
});

const getMyStudyTasks = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { studyPlanId, completed, priority, page, limit } = req.query;
    const result = await StudyTaskService.getStudyTasks({
        userId: req.user?.userId,
        studyPlanId: studyPlanId as string,
        completed: completed === "true" ? true : completed === "false" ? false : undefined,
        priority: priority ? parseInt(priority as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study tasks retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getStudyTaskById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyTaskService.getStudyTaskById(req.params.id, req.user?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study task retrieved successfully",
        data: result,
    });
});

const updateStudyTask = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyTaskService.updateStudyTask(req.params.id, req.user?.userId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study task updated successfully",
        data: result,
    });
});

const deleteStudyTask = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyTaskService.deleteStudyTask(req.params.id, req.user?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

export const StudyTaskController = {
    createStudyTask,
    getMyStudyTasks,
    getStudyTaskById,
    updateStudyTask,
    deleteStudyTask,
};
