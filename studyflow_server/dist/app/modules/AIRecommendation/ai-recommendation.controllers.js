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
exports.AIRecommendationController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const ai_recommendation_services_1 = require("./ai-recommendation.services");
/**
 * Get user's AI recommendations
 */
const getMyRecommendations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { includeApplied } = req.query;
    const result = yield ai_recommendation_services_1.AIRecommendationService.getUserRecommendations(userId, includeApplied === "true");
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Recommendations retrieved successfully",
        data: result,
    });
}));
/**
 * Generate new AI recommendations
 */
const generateNewRecommendations = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield ai_recommendation_services_1.AIRecommendationService.generateRecommendations(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Recommendations generated successfully",
        data: result,
    });
}));
/**
 * Apply a recommendation
 */
const applyRecommendation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield ai_recommendation_services_1.AIRecommendationService.applyRecommendation(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Recommendation applied successfully",
        data: result,
    });
}));
/**
 * Dismiss a recommendation
 */
const dismissRecommendation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield ai_recommendation_services_1.AIRecommendationService.dismissRecommendation(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.AIRecommendationController = {
    getMyRecommendations,
    generateNewRecommendations,
    applyRecommendation,
    dismissRecommendation,
};
