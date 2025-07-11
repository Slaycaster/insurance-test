import { Model } from "objection";

export class Recommendation extends Model {
  static tableName = "recommendations";

  id!: number;
  age!: number;
  income!: number;
  dependents!: number;
  risk_tolerance!: "low" | "medium" | "high";
  recommendation_type!: string;
  coverage_amount!: string;
  term_length!: string;
  explanation!: string;
  ip_address?: string;
  created_at!: Date;
  updated_at!: Date;

  static jsonSchema = {
    type: "object",
    required: [
      "age",
      "income",
      "dependents",
      "risk_tolerance",
      "recommendation_type",
      "coverage_amount",
      "term_length",
      "explanation",
    ],
    properties: {
      id: { type: "integer" },
      age: { type: "integer", minimum: 18, maximum: 100 },
      income: { type: "number", minimum: 0 },
      dependents: { type: "integer", minimum: 0 },
      risk_tolerance: { type: "string", enum: ["low", "medium", "high"] },
      recommendation_type: { type: "string" },
      coverage_amount: { type: "string" },
      term_length: { type: "string" },
      explanation: { type: "string" },
      ip_address: { type: "string" },
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" },
    },
  };
}
