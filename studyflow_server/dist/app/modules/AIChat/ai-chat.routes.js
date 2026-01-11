"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIChatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const ai_chat_controllers_1 = require("./ai-chat.controllers");
const router = express_1.default.Router();
router.post("/start", (0, auth_1.default)(), ai_chat_controllers_1.AIChatControllers.startChat);
router.post("/message", (0, auth_1.default)(), ai_chat_controllers_1.AIChatControllers.sendMessage);
router.get("/:id", (0, auth_1.default)(), ai_chat_controllers_1.AIChatControllers.getChatHistory);
exports.AIChatRoutes = router;
