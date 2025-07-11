import { Router } from "express";
import { RecommendationController } from "../controllers/RecommendationController";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import { recommendationLimiter } from "../middleware/rateLimiter";

const router = Router();

// Get recommendation (public endpoint with rate limiting)
router.post(
  "/",
  recommendationLimiter,
  RecommendationController.validationRules,
  RecommendationController.getRecommendation
);

// Get all recommendations (admin only)
router.get(
  "/",
  authenticateToken,
  requireAdmin,
  RecommendationController.getAllRecommendations
);

export default router;
