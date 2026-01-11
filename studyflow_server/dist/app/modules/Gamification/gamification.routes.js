"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const gamification_controllers_1 = require("./gamification.controllers");
const router = express_1.default.Router();
router.get("/leaderboard", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN), gamification_controllers_1.GamificationControllers.getLeaderboard);
router.get("/my-stats", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN), gamification_controllers_1.GamificationControllers.getMyStats);
// Dev only route to test XP
router.post("/add-xp", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN), gamification_controllers_1.GamificationControllers.addXp);
exports.GamificationRoutes = router;
