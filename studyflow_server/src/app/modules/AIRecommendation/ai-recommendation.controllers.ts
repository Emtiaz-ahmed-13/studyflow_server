import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AIRecommendationService } from "./ai-recommendation.services";


const getMyRecommendations = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { includeApplied } = req.query;

    const result = await AIRecommendationService.getUserRecommendations(
        userId,
        includeApplied === "true"
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Recommendations retrieved successfully",
        data: result,
    });
});

const generateNewRecommendations = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;

    const result = await AIRecommendationService.generateRecommendations(userId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Recommendations generated successfully",
        data: result,
    });
});
const applyRecommendation = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await AIRecommendationService.applyRecommendation(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Recommendation applied successfully",
        data: result,
    });
});

const dismissRecommendation = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await AIRecommendationService.dismissRecommendation(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

export const AIRecommendationController = {
    getMyRecommendations,
    generateNewRecommendations,
    applyRecommendation,
    dismissRecommendation,
};
