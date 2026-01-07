import express from "express";
import auth from "../../middleware/auth";
import { StudyTaskController } from "./study-task.controllers";

const router = express.Router();

router.post("/", auth(), StudyTaskController.createStudyTask);
router.get("/", auth(), StudyTaskController.getMyStudyTasks);
router.get("/:id", auth(), StudyTaskController.getStudyTaskById);
router.patch("/:id", auth(), StudyTaskController.updateStudyTask);
router.delete("/:id", auth(), StudyTaskController.deleteStudyTask);

export const StudyTaskRoutes = router;
