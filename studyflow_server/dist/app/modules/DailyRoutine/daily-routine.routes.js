"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyRoutineRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const daily_routine_controllers_1 = require("./daily-routine.controllers");
const daily_routine_validation_1 = require("./daily-routine.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), (0, validateRequest_1.default)(daily_routine_validation_1.DailyRoutineValidation.createDailyRoutineZodSchema), daily_routine_controllers_1.DailyRoutineController.createRoutine);
router.get("/", (0, auth_1.default)(), daily_routine_controllers_1.DailyRoutineController.getMyRoutines);
router.get("/suggestions", (0, auth_1.default)(), daily_routine_controllers_1.DailyRoutineController.aiGenerateRoutine);
router.get("/:id", (0, auth_1.default)(), daily_routine_controllers_1.DailyRoutineController.getRoutineById);
router.patch("/:id", (0, auth_1.default)(), (0, validateRequest_1.default)(daily_routine_validation_1.DailyRoutineValidation.updateDailyRoutineZodSchema), daily_routine_controllers_1.DailyRoutineController.updateRoutine);
router.delete("/:id", (0, auth_1.default)(), daily_routine_controllers_1.DailyRoutineController.deleteRoutine);
exports.DailyRoutineRoutes = router;
