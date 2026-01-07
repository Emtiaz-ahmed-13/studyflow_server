import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { NoteService } from "./note.services";

const createNote = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await NoteService.createNote(req.user?.userId, req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Note created successfully",
        data: result,
    });
});

const getMyNotes = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { subjectId, searchTerm, tags, page, limit } = req.query;
    const result = await NoteService.getNotes({
        userId: req.user?.userId,
        subjectId: subjectId as string,
        searchTerm: searchTerm as string,
        tags: tags ? (tags as string).split(",") : undefined,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Notes retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const getNoteById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await NoteService.getNoteById(req.params.id, req.user?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Note retrieved successfully",
        data: result,
    });
});

const updateNote = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await NoteService.updateNote(req.params.id, req.user?.userId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Note updated successfully",
        data: result,
    });
});

const deleteNote = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await NoteService.deleteNote(req.params.id, req.user?.userId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
});

const getMarketplaceNotes = catchAsync(async (req: Request, res: Response) => {
    const { subjectId, searchTerm, minRating, page, limit } = req.query;
    const result = await NoteService.getMarketplaceNotes({
        subjectId: subjectId as string,
        searchTerm: searchTerm as string,
        minRating: minRating as string,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Marketplace notes retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
});

const rateNote = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const { rating, comment } = req.body;
    const result = await NoteService.rateNote(req.user?.userId, req.params.id, rating, comment);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Note rated successfully",
        data: result,
    });
});

const generateFlashcards = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const result = await NoteService.generateFlashcards(req.user?.userId, req.params.id);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Flashcards generated successfully",
        data: result,
    });
});

export const NoteController = {
    createNote,
    getMyNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getMarketplaceNotes,
    rateNote,
    generateFlashcards
};
