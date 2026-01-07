import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { StudyTechniqueService } from "./study-technique.services";

const createTechnique = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await StudyTechniqueService.createTechnique(user.id, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Study technique session recorded successfully",
        data: result,
    });
});

const getAllTechniques = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await StudyTechniqueService.getAllTechniques(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study techniques retrieved successfully",
        data: result,
    });
});

const getTechniqueById = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await StudyTechniqueService.getTechniqueById(req.params.id, user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study technique retrieved successfully",
        data: result,
    });
});

const updateTechnique = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await StudyTechniqueService.updateTechnique(req.params.id, user.id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study technique updated successfully",
        data: result,
    });
});

const deleteTechnique = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await StudyTechniqueService.deleteTechnique(req.params.id, user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study technique deleted successfully",
        data: result,
    });
});

const getAnalytics = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const result = await StudyTechniqueService.getAnalytics(user.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Study technique analytics retrieved successfully",
        data: result,
    });
});

export const StudyTechniqueController = {
    createTechnique,
    getAllTechniques,
    getTechniqueById,
    updateTechnique,
    deleteTechnique,
    getAnalytics,
};
