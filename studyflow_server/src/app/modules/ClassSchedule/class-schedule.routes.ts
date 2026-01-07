import express from "express";
import auth from "../../middleware/auth";
import { ClassScheduleController } from "./class-schedule.controllers";

const router = express.Router();

router.post("/", auth(), ClassScheduleController.createClassSchedule);
router.get("/", auth(), ClassScheduleController.getMyClassSchedules);
router.get("/:id", auth(), ClassScheduleController.getClassScheduleById);
router.patch("/:id", auth(), ClassScheduleController.updateClassSchedule);
router.delete("/:id", auth(), ClassScheduleController.deleteClassSchedule);

export const ClassScheduleRoutes = router;
