import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { SubjectService } from "./subject.services";

/**
 * Create a new subject
 */
const createSubject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const data = req.body;

    const result = await SubjectService.createSubject(userId, data);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Subject created successfully",
        data: result,
    });
});

/**
 * Get all subjects for the authenticated user
 */
const getMySubjects = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { searchTerm, page, limit } = req.query;

    const result = await SubjectService.getSubjects({
        userId,
        searchTerm: searchTerm as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Subjects retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

/**
 * Get a single subject by ID
 */
const getSubjectById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await SubjectService.getSubjectById(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Subject retrieved successfully",
        data: result,
    });
});

/**
 * Update a subject
 */
const updateSubject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const data = req.body;

    const result = await SubjectService.updateSubject(id, userId, data);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Subject updated successfully",
        data: result,
    });
});

/**
 * Delete a subject
 */
const deleteSubject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await SubjectService.deleteSubject(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

export const SubjectController = {
    createSubject,
    getMySubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
