import express from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { StudyTechniqueController } from "./study-technique.controllers";
import { StudyTechniqueValidation } from "./study-technique.validation";

const router = express.Router();

router.post(
    "/",
    auth(),
    validateRequest(StudyTechniqueValidation.createStudyTechniqueZodSchema),
    StudyTechniqueController.createTechnique
);

router.get(
    "/",
    auth(),
    StudyTechniqueController.getAllTechniques
);

router.get(
    "/analytics",
    auth(),
    StudyTechniqueController.getAnalytics
);

router.get(
    "/:id",
    auth(),
    StudyTechniqueController.getTechniqueById
);

router.patch(
    "/:id",
    auth(),
    validateRequest(StudyTechniqueValidation.updateStudyTechniqueZodSchema),
    StudyTechniqueController.updateTechnique
);

router.delete(
    "/:id",
    auth(),
    StudyTechniqueController.deleteTechnique
);

export const StudyTechniqueRoutes = router;
