import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { HabitChallengeController } from "./habit-challenge.controllers";
import { HabitChallengeValidation } from "./habit-challenge.validation";

const router = express.Router();

router.post(
    "/",
    auth(),
    validateRequest(HabitChallengeValidation.createHabitChallengeZodSchema),
    HabitChallengeController.createChallenge
);

router.get(
    "/",
    auth(),
    HabitChallengeController.getMyChallenges
);

router.get(
    "/:id",
    auth(),
    HabitChallengeController.getChallengeById
);

router.post(
    "/:id/check-in",
    auth(),
    HabitChallengeController.checkIn
);

router.patch(
    "/:id",
    auth(),
    validateRequest(HabitChallengeValidation.updateHabitChallengeZodSchema),
    HabitChallengeController.updateChallenge
);

router.delete(
    "/:id",
    auth(),
    HabitChallengeController.deleteChallenge
);

export const HabitChallengeRoutes = router;
