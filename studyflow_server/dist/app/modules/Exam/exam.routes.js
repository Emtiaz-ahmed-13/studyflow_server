"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const exam_controllers_1 = require("./exam.controllers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), exam_controllers_1.ExamController.createExam);
router.get("/", (0, auth_1.default)(), exam_controllers_1.ExamController.getMyExams);
router.get("/:id", (0, auth_1.default)(), exam_controllers_1.ExamController.getExamById);
router.patch("/:id", (0, auth_1.default)(), exam_controllers_1.ExamController.updateExam);
router.delete("/:id", (0, auth_1.default)(), exam_controllers_1.ExamController.deleteExam);
router.post("/questions", (0, auth_1.default)(), exam_controllers_1.ExamController.createQuestion);
exports.ExamRoutes = router;
