import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CourseService } from "./course.services";

/**
 * Create a new course
 */
const createCourse = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const data = req.body;

    const result = await CourseService.createCourse(userId, data);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Course created successfully",
        data: result,
    });
});

/**
 * Get all courses for the authenticated user
 */
const getMyCourses = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { subjectId, semester, year, searchTerm, page, limit } = req.query;

    const result = await CourseService.getCourses({
        userId,
        subjectId: subjectId as string,
        semester: semester as string,
        year: year ? parseInt(year as string) : undefined,
        searchTerm: searchTerm as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Courses retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

/**
 * Get a single course by ID
 */
const getCourseById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await CourseService.getCourseById(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Course retrieved successfully",
        data: result,
    });
});

/**
 * Update a course
 */
const updateCourse = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;
    const data = req.body;

    const result = await CourseService.updateCourse(id, userId, data);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Course updated successfully",
        data: result,
    });
});

/**
 * Delete a course
 */
const deleteCourse = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user?.userId;
    const { id } = req.params;

    const result = await CourseService.deleteCourse(id, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

export const CourseController = {
    createCourse,
    getMyCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};
