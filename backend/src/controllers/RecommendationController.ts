import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RecommendationService } from "../services/RecommendationService";
import { Recommendation } from "../models/Recommendation";

export class RecommendationController {
  static validationRules = [
    body("age")
      .isInt({ min: 18, max: 100 })
      .withMessage("Age must be between 18 and 100"),
    body("income")
      .isNumeric()
      .isFloat({ min: 0 })
      .withMessage("Income must be a positive number"),
    body("dependents")
      .isInt({ min: 0 })
      .withMessage("Dependents must be a non-negative integer"),
    body("risk_tolerance")
      .isIn(["low", "medium", "high"])
      .withMessage("Risk tolerance must be low, medium, or high"),
  ];

  static async getRecommendation(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { age, income, dependents, risk_tolerance } = req.body;

      // Generate recommendation
      const recommendation = RecommendationService.generateRecommendation({
        age: parseInt(age),
        income: parseFloat(income),
        dependents: parseInt(dependents),
        risk_tolerance,
      });

      // Save to database
      const savedRecommendation = await Recommendation.query().insert({
        age: parseInt(age),
        income: parseFloat(income),
        dependents: parseInt(dependents),
        risk_tolerance,
        recommendation_type: recommendation.recommendation_type,
        coverage_amount: recommendation.coverage_amount,
        term_length: recommendation.term_length,
        explanation: recommendation.explanation,
        ip_address: req.ip,
      });

      res.status(200).json({
        success: true,
        data: {
          id: savedRecommendation.id,
          ...recommendation,
        },
      });
    } catch (error) {
      console.error("Recommendation error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getAllRecommendations(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const recommendations = await Recommendation.query().orderBy(
        "created_at",
        "desc"
      );

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      console.error("Get recommendations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
