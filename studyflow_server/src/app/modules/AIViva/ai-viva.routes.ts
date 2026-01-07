import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { AIVivaControllers } from "./ai-viva.controllers";

const router = express.Router();

router.post(
    "/start",
    auth(UserRole.STUDENT, UserRole.MODERATOR, UserRole.ADMIN),
    AIVivaControllers.startSession
);

router.post(
    "/response",
    auth(UserRole.STUDENT, UserRole.MODERATOR, UserRole.ADMIN),
    AIVivaControllers.submitResponse
);

router.post(
    "/end",
    auth(UserRole.STUDENT, UserRole.MODERATOR, UserRole.ADMIN),
    AIVivaControllers.endSession
);

export const AIVivaRoutes = router;
