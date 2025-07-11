import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AuthService } from "../services/AuthService";

export class AuthController {
  static validationRules = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];

  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;

      // Attempt login
      const authResult = await AuthService.login({ email, password });

      if (!authResult) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      res.status(200).json({
        success: true,
        data: authResult,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async verify(req: Request, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "Access token required" });
        return;
      }

      const decoded = await AuthService.verifyToken(token);
      if (!decoded) {
        res.status(403).json({ error: "Invalid token" });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user: {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
          },
        },
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
