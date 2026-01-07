import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { DailyRoutineService } from "./daily-routine.services";

const createRoutine = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await DailyRoutineService.createRoutine(user.id, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Daily routine created successfully",
        data: result,
    });
});

const getMyRoutines = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await DailyRoutineService.getMyRoutines(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Daily routines retrieved successfully",
        data: result,
    });
});

const getRoutineById = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await DailyRoutineService.getRoutineById(req.params.id, user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Routine retrieved successfully",
        data: result,
    });
});

const updateRoutine = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await DailyRoutineService.updateRoutine(req.params.id, user.id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Routine updated successfully",
        data: result,
    });
});

const deleteRoutine = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await DailyRoutineService.deleteRoutine(req.params.id, user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Routine deleted successfully",
        data: result,
    });
});

const aiGenerateRoutine = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await DailyRoutineService.aiGenerateRoutine(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Routine suggestion generated",
        data: result,
    });
});

export const DailyRoutineController = {
    createRoutine,
    getMyRoutines,
    getRoutineById,
    updateRoutine,
    deleteRoutine,
    aiGenerateRoutine,
};
