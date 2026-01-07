import express from "express";
import auth from "../../middleware/auth";
import { StudyGroupController } from "./study-group.controllers";

const router = express.Router();

router.post("/", auth(), StudyGroupController.createStudyGroup);
router.get("/", auth(), StudyGroupController.getMyStudyGroups);
router.get("/:id", auth(), StudyGroupController.getStudyGroupById);
router.post("/members", auth(), StudyGroupController.addMember);
router.delete("/:id", auth(), StudyGroupController.deleteStudyGroup);

export const StudyGroupRoutes = router;
