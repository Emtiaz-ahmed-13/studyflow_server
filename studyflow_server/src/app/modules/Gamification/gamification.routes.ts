import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middleware/auth";
import { GamificationControllers } from "./gamification.controllers";

const router = express.Router();

router.get(
    "/leaderboard",
    auth(UserRole.STUDENT, UserRole.MODERATOR, UserRole.ADMIN),
    GamificationControllers.getLeaderboard
);

router.get(
    "/my-stats",
    auth(UserRole.STUDENT, UserRole.MODERATOR, UserRole.ADMIN),
    GamificationControllers.getMyStats
);

// Dev only route to test XP
router.post(
    "/add-xp",
    auth(UserRole.STUDENT, UserRole.MODERATOR, UserRole.ADMIN),
    GamificationControllers.addXp
);

export const GamificationRoutes = router;
