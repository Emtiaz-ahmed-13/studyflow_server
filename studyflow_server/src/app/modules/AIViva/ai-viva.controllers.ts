import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AIVivaServices } from "./ai-viva.services";

const startSession = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;
    const { topic, subjectId } = req.body;
    const result = await AIVivaServices.startSession(userId, topic, subjectId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "AI Viva Session Started",
        data: result,
    });
});

const submitResponse = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;
    const { sessionId, answerText } = req.body;
    const result = await AIVivaServices.submitResponse(sessionId, userId, answerText);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Response submitted successfully",
        data: result,
    });
});

const endSession = catchAsync(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.id;
    const { sessionId } = req.body;
    const result = await AIVivaServices.endSession(sessionId, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Session completed successfully",
        data: result,
    });
});

export const AIVivaControllers = {
    startSession,
    submitResponse,
    endSession
};
