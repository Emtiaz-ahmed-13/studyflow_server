import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { DailyRoutineController } from "./daily-routine.controllers";
import { DailyRoutineValidation } from "./daily-routine.validation";

const router = express.Router();

router.post(
    "/",
    auth(),
    validateRequest(DailyRoutineValidation.createDailyRoutineZodSchema),
    DailyRoutineController.createRoutine
);

router.get(
    "/",
    auth(),
    DailyRoutineController.getMyRoutines
);

router.get(
    "/suggestions",
    auth(),
    DailyRoutineController.aiGenerateRoutine
);

router.get(
    "/:id",
    auth(),
    DailyRoutineController.getRoutineById
);

router.patch(
    "/:id",
    auth(),
    validateRequest(DailyRoutineValidation.updateDailyRoutineZodSchema),
    DailyRoutineController.updateRoutine
);

router.delete(
    "/:id",
    auth(),
    DailyRoutineController.deleteRoutine
);

export const DailyRoutineRoutes = router;
