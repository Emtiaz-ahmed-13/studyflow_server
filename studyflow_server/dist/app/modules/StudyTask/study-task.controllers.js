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
exports.StudyTaskController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const study_task_services_1 = require("./study-task.services");
const createStudyTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_task_services_1.StudyTaskService.createStudyTask((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Study task created successfully",
        data: result,
    });
}));
const getMyStudyTasks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { studyPlanId, completed, priority, page, limit } = req.query;
    const result = yield study_task_services_1.StudyTaskService.getStudyTasks({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        studyPlanId: studyPlanId,
        completed: completed === "true" ? true : completed === "false" ? false : undefined,
        priority: priority ? parseInt(priority) : undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study tasks retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getStudyTaskById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_task_services_1.StudyTaskService.getStudyTaskById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study task retrieved successfully",
        data: result,
    });
}));
const updateStudyTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_task_services_1.StudyTaskService.updateStudyTask(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study task updated successfully",
        data: result,
    });
}));
const deleteStudyTask = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_task_services_1.StudyTaskService.deleteStudyTask(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.StudyTaskController = {
    createStudyTask,
    getMyStudyTasks,
    getStudyTaskById,
    updateStudyTask,
    deleteStudyTask,
};
