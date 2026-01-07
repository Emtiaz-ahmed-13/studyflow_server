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
exports.ClassScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const class_schedule_services_1 = require("./class-schedule.services");
const createClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const data = req.body;
    const result = yield class_schedule_services_1.ClassScheduleService.createClassSchedule(userId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Class schedule created successfully",
        data: result,
    });
}));
const getMyClassSchedules = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { subjectId, dayOfWeek, page, limit } = req.query;
    const result = yield class_schedule_services_1.ClassScheduleService.getClassSchedules({
        userId,
        subjectId: subjectId,
        dayOfWeek: dayOfWeek ? parseInt(dayOfWeek) : undefined,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 50,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Class schedules retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getClassScheduleById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield class_schedule_services_1.ClassScheduleService.getClassScheduleById(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Class schedule retrieved successfully",
        data: result,
    });
}));
const updateClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const data = req.body;
    const result = yield class_schedule_services_1.ClassScheduleService.updateClassSchedule(id, userId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Class schedule updated successfully",
        data: result,
    });
}));
const deleteClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield class_schedule_services_1.ClassScheduleService.deleteClassSchedule(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.ClassScheduleController = {
    createClassSchedule,
    getMyClassSchedules,
    getClassScheduleById,
    updateClassSchedule,
    deleteClassSchedule,
};
