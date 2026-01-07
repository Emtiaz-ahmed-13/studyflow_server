"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const class_schedule_controllers_1 = require("./class-schedule.controllers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), class_schedule_controllers_1.ClassScheduleController.createClassSchedule);
router.get("/", (0, auth_1.default)(), class_schedule_controllers_1.ClassScheduleController.getMyClassSchedules);
router.get("/:id", (0, auth_1.default)(), class_schedule_controllers_1.ClassScheduleController.getClassScheduleById);
router.patch("/:id", (0, auth_1.default)(), class_schedule_controllers_1.ClassScheduleController.updateClassSchedule);
router.delete("/:id", (0, auth_1.default)(), class_schedule_controllers_1.ClassScheduleController.deleteClassSchedule);
exports.ClassScheduleRoutes = router;
