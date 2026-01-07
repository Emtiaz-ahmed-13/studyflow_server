"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudyGroupRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const study_group_controllers_1 = require("./study-group.controllers");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(), study_group_controllers_1.StudyGroupController.createStudyGroup);
router.get("/", (0, auth_1.default)(), study_group_controllers_1.StudyGroupController.getMyStudyGroups);
router.get("/:id", (0, auth_1.default)(), study_group_controllers_1.StudyGroupController.getStudyGroupById);
router.post("/members", (0, auth_1.default)(), study_group_controllers_1.StudyGroupController.addMember);
router.delete("/:id", (0, auth_1.default)(), study_group_controllers_1.StudyGroupController.deleteStudyGroup);
exports.StudyGroupRoutes = router;
