import express from "express";
import auth from "../../middleware/auth";
import { SubjectController } from "./subject.controllers";

const router = express.Router();

// Create a new subject
router.post("/", auth(), SubjectController.createSubject);

// Get all subjects for authenticated user
router.get("/", auth(), SubjectController.getMySubjects);

// Get a single subject by ID
router.get("/:id", auth(), SubjectController.getSubjectById);

// Update a subject
router.patch("/:id", auth(), SubjectController.updateSubject);

// Delete a subject
router.delete("/:id", auth(), SubjectController.deleteSubject);

export const SubjectRoutes = router;
