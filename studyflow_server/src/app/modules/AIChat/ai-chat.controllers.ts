import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AIChatServices } from "./ai-chat.services";

const startChat = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { readingMaterialId } = req.body;
    const result = await AIChatServices.startChat(req.user?.userId, readingMaterialId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "PDF Chat Session Started",
        data: result,
    });
});

const sendMessage = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { sessionId, message } = req.body;
    const result = await AIChatServices.sendMessage(req.user?.userId, sessionId, message);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});

const getChatHistory = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { id } = req.params;
    const result = await AIChatServices.getChatHistory(req.user?.userId, id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chat history retrieved",
        data: result,
    });
});

export const AIChatControllers = {
    startChat,
    sendMessage,
    getChatHistory
};
