import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StudyPlanService } from "./study-plan.services";

const createStudyPlan = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyPlanService.createStudyPlan(req.user?.userId, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Study plan created successfully",
        data: result,
    });
});

const getMyStudyPlans = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { subjectId, active, page, limit } = req.query;
    const result = await StudyPlanService.getStudyPlans({
        userId: req.user?.userId,
        subjectId: subjectId as string,
        active: active === "true",
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study plans retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getStudyPlanById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyPlanService.getStudyPlanById(req.params.id, req.user?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study plan retrieved successfully",
        data: result,
    });
});

const updateStudyPlan = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyPlanService.updateStudyPlan(req.params.id, req.user?.userId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study plan updated successfully",
        data: result,
    });
});

const deleteStudyPlan = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyPlanService.deleteStudyPlan(req.params.id, req.user?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

export const StudyPlanController = {
    createStudyPlan,
    getMyStudyPlans,
    getStudyPlanById,
    updateStudyPlan,
    deleteStudyPlan,
};
