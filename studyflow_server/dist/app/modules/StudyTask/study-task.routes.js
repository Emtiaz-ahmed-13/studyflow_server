"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyTaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const study_task_controllers_1 = require("./study-task.controllers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), study_task_controllers_1.StudyTaskController.createStudyTask);
router.get("/", (0, auth_1.default)(), study_task_controllers_1.StudyTaskController.getMyStudyTasks);
router.get("/:id", (0, auth_1.default)(), study_task_controllers_1.StudyTaskController.getStudyTaskById);
router.patch("/:id", (0, auth_1.default)(), study_task_controllers_1.StudyTaskController.updateStudyTask);
router.delete("/:id", (0, auth_1.default)(), study_task_controllers_1.StudyTaskController.deleteStudyTask);
exports.StudyTaskRoutes = router;
