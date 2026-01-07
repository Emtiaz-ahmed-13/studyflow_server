"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyTechniqueRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const study_technique_controllers_1 = require("./study-technique.controllers");
const study_technique_validation_1 = require("./study-technique.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), (0, validateRequest_1.default)(study_technique_validation_1.StudyTechniqueValidation.createStudyTechniqueZodSchema), study_technique_controllers_1.StudyTechniqueController.createTechnique);
router.get("/", (0, auth_1.default)(), study_technique_controllers_1.StudyTechniqueController.getAllTechniques);
router.get("/analytics", (0, auth_1.default)(), study_technique_controllers_1.StudyTechniqueController.getAnalytics);
router.get("/:id", (0, auth_1.default)(), study_technique_controllers_1.StudyTechniqueController.getTechniqueById);
router.patch("/:id", (0, auth_1.default)(), (0, validateRequest_1.default)(study_technique_validation_1.StudyTechniqueValidation.updateStudyTechniqueZodSchema), study_technique_controllers_1.StudyTechniqueController.updateTechnique);
router.delete("/:id", (0, auth_1.default)(), study_technique_controllers_1.StudyTechniqueController.deleteTechnique);
exports.StudyTechniqueRoutes = router;
