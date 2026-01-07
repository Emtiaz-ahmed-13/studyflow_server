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
exports.DailyRoutineController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const daily_routine_services_1 = require("./daily-routine.services");
const createRoutine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield daily_routine_services_1.DailyRoutineService.createRoutine(user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Daily routine created successfully",
        data: result,
    });
}));
const getMyRoutines = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield daily_routine_services_1.DailyRoutineService.getMyRoutines(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Daily routines retrieved successfully",
        data: result,
    });
}));
const getRoutineById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield daily_routine_services_1.DailyRoutineService.getRoutineById(req.params.id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Routine retrieved successfully",
        data: result,
    });
}));
const updateRoutine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield daily_routine_services_1.DailyRoutineService.updateRoutine(req.params.id, user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Routine updated successfully",
        data: result,
    });
}));
const deleteRoutine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield daily_routine_services_1.DailyRoutineService.deleteRoutine(req.params.id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Routine deleted successfully",
        data: result,
    });
}));
const aiGenerateRoutine = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield daily_routine_services_1.DailyRoutineService.aiGenerateRoutine(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Routine suggestion generated",
        data: result,
    });
}));
exports.DailyRoutineController = {
    createRoutine,
    getMyRoutines,
    getRoutineById,
    updateRoutine,
    deleteRoutine,
    aiGenerateRoutine,
};
