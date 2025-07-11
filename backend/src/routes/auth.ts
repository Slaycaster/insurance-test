import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

// Login endpoint
router.post(
  "/login",
  authLimiter,
  AuthController.validationRules,
  AuthController.login
);

// Verify token endpoint
router.get("/verify", AuthController.verify);

export default router;
