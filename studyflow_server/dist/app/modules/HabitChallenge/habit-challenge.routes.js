"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HabitChallengeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const habit_challenge_controllers_1 = require("./habit-challenge.controllers");
const habit_challenge_validation_1 = require("./habit-challenge.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), (0, validateRequest_1.default)(habit_challenge_validation_1.HabitChallengeValidation.createHabitChallengeZodSchema), habit_challenge_controllers_1.HabitChallengeController.createChallenge);
router.get("/", (0, auth_1.default)(), habit_challenge_controllers_1.HabitChallengeController.getMyChallenges);
router.get("/:id", (0, auth_1.default)(), habit_challenge_controllers_1.HabitChallengeController.getChallengeById);
router.post("/:id/check-in", (0, auth_1.default)(), habit_challenge_controllers_1.HabitChallengeController.checkIn);
router.patch("/:id", (0, auth_1.default)(), (0, validateRequest_1.default)(habit_challenge_validation_1.HabitChallengeValidation.updateHabitChallengeZodSchema), habit_challenge_controllers_1.HabitChallengeController.updateChallenge);
router.delete("/:id", (0, auth_1.default)(), habit_challenge_controllers_1.HabitChallengeController.deleteChallenge);
exports.HabitChallengeRoutes = router;
