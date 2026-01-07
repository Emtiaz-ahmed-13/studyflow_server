"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const subject_controllers_1 = require("./subject.controllers");
const router = express_1.default.Router();
// Create a new subject
router.post("/", (0, auth_1.default)(), subject_controllers_1.SubjectController.createSubject);
// Get all subjects for authenticated user
router.get("/", (0, auth_1.default)(), subject_controllers_1.SubjectController.getMySubjects);
// Get a single subject by ID
router.get("/:id", (0, auth_1.default)(), subject_controllers_1.SubjectController.getSubjectById);
// Update a subject
router.patch("/:id", (0, auth_1.default)(), subject_controllers_1.SubjectController.updateSubject);
// Delete a subject
router.delete("/:id", (0, auth_1.default)(), subject_controllers_1.SubjectController.deleteSubject);
exports.SubjectRoutes = router;
