"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const note_services_1 = require("./note.services");
const createNote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield note_services_1.NoteService.createNote((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Note created successfully",
        data: result,
    });
}));
const getMyNotes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { subjectId, searchTerm, tags, page, limit } = req.query;
    const result = yield note_services_1.NoteService.getNotes({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        subjectId: subjectId,
        searchTerm: searchTerm,
        tags: tags ? tags.split(",") : undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Notes retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getNoteById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield note_services_1.NoteService.getNoteById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Note retrieved successfully",
        data: result,
    });
}));
const updateNote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield note_services_1.NoteService.updateNote(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Note updated successfully",
        data: result,
    });
}));
const deleteNote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield note_services_1.NoteService.deleteNote(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
const getMarketplaceNotes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subjectId, searchTerm, minRating, page, limit } = req.query;
    const result = yield note_services_1.NoteService.getMarketplaceNotes({
        subjectId: subjectId,
        searchTerm: searchTerm,
        minRating: minRating,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Marketplace notes retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const rateNote = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { rating, comment } = req.body;
    const result = yield note_services_1.NoteService.rateNote((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.params.id, rating, comment);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Note rated successfully",
        data: result,
    });
}));
const generateFlashcards = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield note_services_1.NoteService.generateFlashcards((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Flashcards generated successfully",
        data: result,
    });
}));
exports.NoteController = {
    createNote,
    getMyNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getMarketplaceNotes,
    rateNote,
    generateFlashcards
};
