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
exports.ExamController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const exam_services_1 = require("./exam.services");
const createExam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield exam_services_1.ExamService.createExam((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: "Exam created successfully", data: result });
}));
const getMyExams = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { subjectId, upcoming, page, limit } = req.query;
    const result = yield exam_services_1.ExamService.getExams({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        subjectId: subjectId,
        upcoming: upcoming === "true",
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Exams retrieved successfully", data: result.data, meta: result.meta });
}));
const getExamById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield exam_services_1.ExamService.getExamById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Exam retrieved successfully", data: result });
}));
const updateExam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield exam_services_1.ExamService.updateExam(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Exam updated successfully", data: result });
}));
const deleteExam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield exam_services_1.ExamService.deleteExam(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: result.message, data: null });
}));
const createQuestion = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield exam_services_1.ExamService.createQuestion((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: "Question created successfully", data: result });
}));
exports.ExamController = {
    createExam,
    getMyExams,
    getExamById,
    updateExam,
    deleteExam,
    createQuestion,
};
