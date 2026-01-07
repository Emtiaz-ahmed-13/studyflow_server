"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyPlanRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const study_plan_controllers_1 = require("./study-plan.controllers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), study_plan_controllers_1.StudyPlanController.createStudyPlan);
router.get("/", (0, auth_1.default)(), study_plan_controllers_1.StudyPlanController.getMyStudyPlans);
router.get("/:id", (0, auth_1.default)(), study_plan_controllers_1.StudyPlanController.getStudyPlanById);
router.patch("/:id", (0, auth_1.default)(), study_plan_controllers_1.StudyPlanController.updateStudyPlan);
router.delete("/:id", (0, auth_1.default)(), study_plan_controllers_1.StudyPlanController.deleteStudyPlan);
exports.StudyPlanRoutes = router;
