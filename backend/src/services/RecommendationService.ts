export interface RecommendationInput {
  age: number;
  income: number;
  dependents: number;
  risk_tolerance: "low" | "medium" | "high";
}

export interface RecommendationResult {
  recommendation_type: string;
  coverage_amount: string;
  term_length: string;
  explanation: string;
}

export class RecommendationService {
  static generateRecommendation(
    input: RecommendationInput
  ): RecommendationResult {
    const { age, income, dependents, risk_tolerance } = input;

    // Basic recommendation algorithm
    let coverageMultiplier = 5; // Base coverage of 5x income
    let termLength = 20; // Default 20 years
    let recommendationType = "Term Life";

    // Adjust based on dependents
    if (dependents > 0) {
      coverageMultiplier += dependents * 2;
    }

    // Adjust based on age
    if (age > 50) {
      termLength = 15;
      if (age > 60) {
        recommendationType = "Whole Life";
        coverageMultiplier *= 0.8;
      }
    }

    // Adjust based on risk tolerance
    switch (risk_tolerance) {
      case "low":
        recommendationType = "Whole Life";
        coverageMultiplier *= 1.2;
        break;
      case "high":
        coverageMultiplier *= 1.5;
        termLength = 30;
        break;
      default:
        // medium risk tolerance keeps defaults
        break;
    }

    const coverageAmount = Math.round(income * coverageMultiplier);
    const formattedCoverage = `$${coverageAmount.toLocaleString()}`;

    let explanation = `Based on your profile (age ${age}, income ${income.toLocaleString()}, ${dependents} dependents, ${risk_tolerance} risk tolerance), `;

    if (recommendationType === "Term Life") {
      explanation += `we recommend Term Life Insurance for its affordability and flexibility. `;
    } else {
      explanation += `we recommend Whole Life Insurance for its guaranteed coverage and cash value component. `;
    }

    explanation += `The coverage amount of ${formattedCoverage} provides ${coverageMultiplier}x your annual income, `;
    explanation += `which should adequately protect your dependents and cover expenses. `;
    explanation += `The ${termLength}-year term aligns with your expected financial obligations period.`;

    return {
      recommendation_type: recommendationType,
      coverage_amount: formattedCoverage,
      term_length: `${termLength} years`,
      explanation,
    };
  }
}
