"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WellnessRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const wellness_controllers_1 = require("./wellness.controllers");
const wellness_validation_1 = require("./wellness.validation");
const router = express_1.default.Router();
router.post("/meditation", (0, auth_1.default)(), (0, validateRequest_1.default)(wellness_validation_1.WellnessValidation.createMeditationZodSchema), wellness_controllers_1.WellnessController.createMeditation);
router.get("/meditation", (0, auth_1.default)(), wellness_controllers_1.WellnessController.getMeditationHistory);
router.post("/activity", (0, auth_1.default)(), (0, validateRequest_1.default)(wellness_validation_1.WellnessValidation.createWellnessActivityZodSchema), wellness_controllers_1.WellnessController.createWellnessActivity);
router.get("/activity", (0, auth_1.default)(), wellness_controllers_1.WellnessController.getWellnessHistory);
router.get("/analytics", (0, auth_1.default)(), wellness_controllers_1.WellnessController.getAnalytics);
exports.WellnessRoutes = router;
