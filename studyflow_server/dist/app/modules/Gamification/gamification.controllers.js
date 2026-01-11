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
exports.GamificationControllers = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const gamification_services_1 = require("./gamification.services");
const getLeaderboard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield gamification_services_1.GamificationServices.getLeaderboard();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Leaderboard retrieved successfully",
        data: result,
    });
}));
const getMyStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.user.id;
    const result = yield gamification_services_1.GamificationServices.getUserStats(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User stats retrieved successfully",
        data: result,
    });
}));
const addXp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const userId = req.user.id;
    const { xpAmount } = req.body;
    const result = yield gamification_services_1.GamificationServices.addXp(userId, xpAmount);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "XP added successfully",
        data: result,
    });
}));
exports.GamificationControllers = {
    getLeaderboard,
    getMyStats,
    addXp
};
