"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIVivaRoutes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const ai_viva_controllers_1 = require("./ai-viva.controllers");
const router = express_1.default.Router();
router.post("/start", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN), ai_viva_controllers_1.AIVivaControllers.startSession);
router.post("/response", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN), ai_viva_controllers_1.AIVivaControllers.submitResponse);
router.post("/end", (0, auth_1.default)(client_1.UserRole.STUDENT, client_1.UserRole.MODERATOR, client_1.UserRole.ADMIN), ai_viva_controllers_1.AIVivaControllers.endSession);
exports.AIVivaRoutes = router;
