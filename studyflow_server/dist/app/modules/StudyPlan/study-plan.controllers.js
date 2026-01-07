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
exports.StudyPlanController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const study_plan_services_1 = require("./study-plan.services");
const createStudyPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_plan_services_1.StudyPlanService.createStudyPlan((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Study plan created successfully",
        data: result,
    });
}));
const getMyStudyPlans = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { subjectId, active, page, limit } = req.query;
    const result = yield study_plan_services_1.StudyPlanService.getStudyPlans({
        userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
        subjectId: subjectId,
        active: active === "true",
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study plans retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
const getStudyPlanById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_plan_services_1.StudyPlanService.getStudyPlanById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study plan retrieved successfully",
        data: result,
    });
}));
const updateStudyPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_plan_services_1.StudyPlanService.updateStudyPlan(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study plan updated successfully",
        data: result,
    });
}));
const deleteStudyPlan = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_plan_services_1.StudyPlanService.deleteStudyPlan(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.StudyPlanController = {
    createStudyPlan,
    getMyStudyPlans,
    getStudyPlanById,
    updateStudyPlan,
    deleteStudyPlan,
};
