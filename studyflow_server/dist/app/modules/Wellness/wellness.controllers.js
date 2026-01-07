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
exports.WellnessController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const wellness_services_1 = require("./wellness.services");
const createMeditation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield wellness_services_1.WellnessService.createMeditation(user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Meditation session logged successfully",
        data: result,
    });
}));
const getMeditationHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield wellness_services_1.WellnessService.getMeditationHistory(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Meditation history retrieved successfully",
        data: result,
    });
}));
const createWellnessActivity = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield wellness_services_1.WellnessService.createWellnessActivity(user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Wellness activity logged successfully",
        data: result,
    });
}));
const getWellnessHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield wellness_services_1.WellnessService.getWellnessHistory(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Wellness history retrieved successfully",
        data: result,
    });
}));
const getAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield wellness_services_1.WellnessService.getAnalytics(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Wellness analytics retrieved successfully",
        data: result,
    });
}));
exports.WellnessController = {
    createMeditation,
    getMeditationHistory,
    createWellnessActivity,
    getWellnessHistory,
    getAnalytics,
};
