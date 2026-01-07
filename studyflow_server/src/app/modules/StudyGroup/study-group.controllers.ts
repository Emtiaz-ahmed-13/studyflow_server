import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StudyGroupService } from "./study-group.services";

const createStudyGroup = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyGroupService.createStudyGroup(req.user?.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Study group created successfully", data: result });
});

const getMyStudyGroups = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyGroupService.getMyStudyGroups(req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: "Study groups retrieved successfully", data: result });
});

const getStudyGroupById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyGroupService.getStudyGroupById(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: "Study group retrieved successfully", data: result });
});

const addMember = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyGroupService.addMember(req.user?.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: "Member added successfully", data: result });
});

const deleteStudyGroup = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await StudyGroupService.deleteStudyGroup(req.params.id, req.user?.userId);
    sendResponse(res, { statusCode: 200, success: true, message: result.message, data: null });
});

export const StudyGroupController = {
    createStudyGroup,
    getMyStudyGroups,
    getStudyGroupById,
    addMember,
    deleteStudyGroup,
};
