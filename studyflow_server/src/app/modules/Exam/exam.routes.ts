import express from "express";
import auth from "../../middleware/auth";
import { ExamController } from "./exam.controllers";

const router = express.Router();

router.post("/", auth(), ExamController.createExam);
router.get("/", auth(), ExamController.getMyExams);
router.get("/:id", auth(), ExamController.getExamById);
router.patch("/:id", auth(), ExamController.updateExam);
router.delete("/:id", auth(), ExamController.deleteExam);
router.post("/questions", auth(), ExamController.createQuestion);

export const ExamRoutes = router;
