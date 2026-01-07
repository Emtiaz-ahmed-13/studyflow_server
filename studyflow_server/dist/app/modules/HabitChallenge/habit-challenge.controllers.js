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
exports.HabitChallengeController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const habit_challenge_services_1 = require("./habit-challenge.services");
const createChallenge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield habit_challenge_services_1.HabitChallengeService.createChallenge(user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Habit challenge created successfully",
        data: result,
    });
}));
const getMyChallenges = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield habit_challenge_services_1.HabitChallengeService.getMyChallenges(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenges retrieved successfully",
        data: result,
    });
}));
const getChallengeById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield habit_challenge_services_1.HabitChallengeService.getChallengeById(req.params.id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenge retrieved successfully",
        data: result,
    });
}));
const checkIn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield habit_challenge_services_1.HabitChallengeService.checkIn(req.params.id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Check-in successful",
        data: result,
    });
}));
const updateChallenge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield habit_challenge_services_1.HabitChallengeService.updateChallenge(req.params.id, user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenge updated successfully",
        data: result,
    });
}));
const deleteChallenge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield habit_challenge_services_1.HabitChallengeService.deleteChallenge(req.params.id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Habit challenge deleted successfully",
        data: result,
    });
}));
exports.HabitChallengeController = {
    createChallenge,
    getMyChallenges,
    getChallengeById,
    checkIn,
    updateChallenge,
    deleteChallenge,
};
