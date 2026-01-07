import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { WellnessService } from "./wellness.services";

const createMeditation = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await WellnessService.createMeditation(user.id, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Meditation session logged successfully",
        data: result,
    });
});

const getMeditationHistory = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await WellnessService.getMeditationHistory(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Meditation history retrieved successfully",
        data: result,
    });
});

const createWellnessActivity = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await WellnessService.createWellnessActivity(user.id, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Wellness activity logged successfully",
        data: result,
    });
});

const getWellnessHistory = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await WellnessService.getWellnessHistory(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Wellness history retrieved successfully",
        data: result,
    });
});

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await WellnessService.getAnalytics(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Wellness analytics retrieved successfully",
        data: result,
    });
});

export const WellnessController = {
    createMeditation,
    getMeditationHistory,
    createWellnessActivity,
    getWellnessHistory,
    getAnalytics,
};
