import express from "express";
import auth from "../../middleware/auth";
import { AIRecommendationController } from "./ai-recommendation.controllers";

const router = express.Router();

router.get("/", auth(), AIRecommendationController.getMyRecommendations);
router.post("/generate", auth(), AIRecommendationController.generateNewRecommendations);
router.patch("/:id/apply", auth(), AIRecommendationController.applyRecommendation);
router.delete("/:id", auth(), AIRecommendationController.dismissRecommendation);

export const AIRecommendationRoutes = router;
