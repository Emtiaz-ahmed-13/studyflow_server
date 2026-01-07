import express from "express";
import auth from "../../middleware/auth";
import { AIChatControllers } from "./ai-chat.controllers";

const router = express.Router();

router.post("/start", auth(), AIChatControllers.startChat);
router.post("/message", auth(), AIChatControllers.sendMessage);
router.get("/:id", auth(), AIChatControllers.getChatHistory);

export const AIChatRoutes = router;
