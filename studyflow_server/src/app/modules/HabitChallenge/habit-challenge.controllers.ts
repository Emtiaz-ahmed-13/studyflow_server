import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { HabitChallengeService } from "./habit-challenge.services";

const createChallenge = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await HabitChallengeService.createChallenge(user.id, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Habit challenge created successfully",
        data: result,
    });
});

const getMyChallenges = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await HabitChallengeService.getMyChallenges(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenges retrieved successfully",
        data: result,
    });
});

const getChallengeById = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await HabitChallengeService.getChallengeById(req.params.id, user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenge retrieved successfully",
        data: result,
    });
});

const checkIn = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await HabitChallengeService.checkIn(req.params.id, user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Check-in successful",
        data: result,
    });
});

const updateChallenge = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await HabitChallengeService.updateChallenge(req.params.id, user.id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenge updated successfully",
        data: result,
    });
});

const deleteChallenge = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await HabitChallengeService.deleteChallenge(req.params.id, user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenge deleted successfully",
        data: result,
    });
});

export const HabitChallengeController = {
    createChallenge,
    getMyChallenges,
    getChallengeById,
    checkIn,
    updateChallenge,
    deleteChallenge,
};
