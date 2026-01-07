import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { NotificationService } from "./notification.services";

/**
 * Get user's notifications
 */
const getMyNotifications = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { isRead, type, page, limit } = req.query;

    const result = await NotificationService.getUserNotifications({
        userId,
        isRead: isRead === "true" ? true : isRead === "false" ? false : undefined,
        type: type as any,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Notifications retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

/**
 * Mark notification as read
 */
const markNotificationAsRead = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await NotificationService.markAsRead(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Notification marked as read",
        data: result,
    });
});

/**
 * Mark all notifications as read
 */
const markAllAsRead = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;

    const result = await NotificationService.markAllAsRead(userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "All notifications marked as read",
        data: result,
    });
});

/**
 * Delete a notification
 */
const deleteNotification = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await NotificationService.deleteNotification(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

export const NotificationController = {
    getMyNotifications,
    markNotificationAsRead,
    markAllAsRead,
    deleteNotification,
};
