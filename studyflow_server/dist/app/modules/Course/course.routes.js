"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const course_controllers_1 = require("./course.controllers");
const router = express_1.default.Router();
// Create a new course
router.post("/", (0, auth_1.default)(), course_controllers_1.CourseController.createCourse);
// Get all courses for authenticated user
router.get("/", (0, auth_1.default)(), course_controllers_1.CourseController.getMyCourses);
// Get a single course by ID
router.get("/:id", (0, auth_1.default)(), course_controllers_1.CourseController.getCourseById);
// Update a course
router.patch("/:id", (0, auth_1.default)(), course_controllers_1.CourseController.updateCourse);
// Delete a course
router.delete("/:id", (0, auth_1.default)(), course_controllers_1.CourseController.deleteCourse);
exports.CourseRoutes = router;
