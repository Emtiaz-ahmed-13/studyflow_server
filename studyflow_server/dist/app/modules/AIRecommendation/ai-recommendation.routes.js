"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIRecommendationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const ai_recommendation_controllers_1 = require("./ai-recommendation.controllers");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(), ai_recommendation_controllers_1.AIRecommendationController.getMyRecommendations);
router.post("/generate", (0, auth_1.default)(), ai_recommendation_controllers_1.AIRecommendationController.generateNewRecommendations);
router.patch("/:id/apply", (0, auth_1.default)(), ai_recommendation_controllers_1.AIRecommendationController.applyRecommendation);
router.delete("/:id", (0, auth_1.default)(), ai_recommendation_controllers_1.AIRecommendationController.dismissRecommendation);
exports.AIRecommendationRoutes = router;
