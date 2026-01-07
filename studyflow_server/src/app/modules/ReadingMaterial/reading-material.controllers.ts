import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { ReadingMaterialService } from "./reading-material.services";

const createReadingMaterial = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const file = req.file;

    const result = await ReadingMaterialService.uploadReadingMaterial(
        req.user.id,
        file,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Reading material uploaded successfully",
        data: result,
    });
});

const getAllReadingMaterials = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ReadingMaterialService.getAllReadingMaterials(req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reading materials retrieved successfully",
        data: result,
    });
});

const getReadingMaterialById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ReadingMaterialService.getReadingMaterialById(req.params.id, req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reading material retrieved successfully",
        data: result,
    });
});

const deleteReadingMaterial = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await ReadingMaterialService.deleteReadingMaterial(req.params.id, req.user.id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reading material deleted successfully",
        data: result,
    });
});

export const ReadingMaterialController = {
    createReadingMaterial,
    getAllReadingMaterials,
    getReadingMaterialById,
    deleteReadingMaterial,
};
