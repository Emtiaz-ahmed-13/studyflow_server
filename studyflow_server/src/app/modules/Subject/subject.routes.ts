import express from "express";
import auth from "../../middleware/auth";
import { SubjectController } from "./subject.controllers";

const router = express.Router();

router.post("/", auth(), SubjectController.createSubject);
router.get("/", auth(), SubjectController.getMySubjects);
router.get("/:id", auth(), SubjectController.getSubjectById);
router.patch("/:id", auth(), SubjectController.updateSubject);
router.delete("/:id", auth(), SubjectController.deleteSubject);

export const SubjectRoutes = router;
