import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ClassScheduleService } from "./class-schedule.services";

const createClassSchedule = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const data = req.body;

    const result = await ClassScheduleService.createClassSchedule(userId, data);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Class schedule created successfully",
        data: result,
    });
});

const getMyClassSchedules = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { subjectId, dayOfWeek, page, limit } = req.query;

    const result = await ClassScheduleService.getClassSchedules({
        userId,
        subjectId: subjectId as string,
        dayOfWeek: dayOfWeek ? parseInt(dayOfWeek as string) : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Class schedules retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getClassScheduleById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await ClassScheduleService.getClassScheduleById(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Class schedule retrieved successfully",
        data: result,
    });
});

const updateClassSchedule = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const data = req.body;

    const result = await ClassScheduleService.updateClassSchedule(id, userId, data);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Class schedule updated successfully",
        data: result,
    });
});

const deleteClassSchedule = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await ClassScheduleService.deleteClassSchedule(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

export const ClassScheduleController = {
    createClassSchedule,
    getMyClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule,
};
