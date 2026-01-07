import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { WellnessController } from "./wellness.controllers";
import { WellnessValidation } from "./wellness.validation";

const router = express.Router();

router.post(
    "/meditation",
    auth(),
    validateRequest(WellnessValidation.createMeditationZodSchema),
    WellnessController.createMeditation
);

router.get(
    "/meditation",
    auth(),
    WellnessController.getMeditationHistory
);

router.post(
    "/activity",
    auth(),
    validateRequest(WellnessValidation.createWellnessActivityZodSchema),
    WellnessController.createWellnessActivity
);

router.get(
    "/activity",
    auth(),
    WellnessController.getWellnessHistory
);

router.get(
    "/analytics",
    auth(),
    WellnessController.getAnalytics
);

export const WellnessRoutes = router;
