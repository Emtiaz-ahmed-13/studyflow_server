import express from "express";
import auth from "../../middleware/auth";
import { StudyPlanController } from "./study-plan.controllers";

const router = express.Router();

router.post("/", auth(), StudyPlanController.createStudyPlan);
router.get("/", auth(), StudyPlanController.getMyStudyPlans);
router.get("/:id", auth(), StudyPlanController.getStudyPlanById);
router.patch("/:id", auth(), StudyPlanController.updateStudyPlan);
router.delete("/:id", auth(), StudyPlanController.deleteStudyPlan);

export const StudyPlanRoutes = router;
