import express from "express";
import auth from "../../middleware/auth";
import { CourseController } from "./course.controllers";

const router = express.Router();

// Create a new course
router.post("/", auth(), CourseController.createCourse);

// Get all courses for authenticated user
router.get("/", auth(), CourseController.getMyCourses);

// Get a single course by ID
router.get("/:id", auth(), CourseController.getCourseById);

// Update a course
router.patch("/:id", auth(), CourseController.updateCourse);

// Delete a course
router.delete("/:id", auth(), CourseController.deleteCourse);

export const CourseRoutes = router;
