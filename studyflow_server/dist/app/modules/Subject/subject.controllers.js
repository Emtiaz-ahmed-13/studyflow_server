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
exports.SubjectController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const subject_services_1 = require("./subject.services");
/**
 * Create a new subject
 */
const createSubject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const data = req.body;
    const result = yield subject_services_1.SubjectService.createSubject(userId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Subject created successfully",
        data: result,
    });
}));
/**
 * Get all subjects for the authenticated user
 */
const getMySubjects = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { searchTerm, page, limit } = req.query;
    const result = yield subject_services_1.SubjectService.getSubjects({
        userId,
        searchTerm: searchTerm,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subjects retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/**
 * Get a single subject by ID
 */
const getSubjectById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield subject_services_1.SubjectService.getSubjectById(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subject retrieved successfully",
        data: result,
    });
}));
/**
 * Update a subject
 */
const updateSubject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const data = req.body;
    const result = yield subject_services_1.SubjectService.updateSubject(id, userId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subject updated successfully",
        data: result,
    });
}));
/**
 * Delete a subject
 */
const deleteSubject = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield subject_services_1.SubjectService.deleteSubject(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.SubjectController = {
    createSubject,
    getMySubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
