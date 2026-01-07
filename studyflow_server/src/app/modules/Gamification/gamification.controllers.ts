import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { GamificationServices } from "./gamification.services";

const getLeaderboard = catchAsync(async (req: Request, res: Response) => {
    const result = await GamificationServices.getLeaderboard();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Leaderboard retrieved successfully",
        data: result,
    });
});

const getMyStats = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;
    const result = await GamificationServices.getUserStats(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats retrieved successfully",
        data: result,
    });
});

const addXp = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;
    const { xpAmount } = req.body;
    const result = await GamificationServices.addXp(userId, xpAmount);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "XP added successfully",
        data: result,
    });
});

export const GamificationControllers = {
    getLeaderboard,
    getMyStats,
    addXp
};
