"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  getRecommendation,
  RecommendationRequest,
  RecommendationResponse,
} from "@/lib/api";

export default function Home() {
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecommendationRequest>();

  const onSubmit = async (data: RecommendationRequest) => {
    setIsLoading(true);
    try {
      const result = await getRecommendation(data);
      setRecommendation(result);
      toast.success("Recommendation generated successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to get recommendation"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRecommendation = () => {
    setRecommendation(null);
    reset();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Life Insurance Recommendation Engine
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized life insurance recommendations based on your
            profile
          </p>
        </div>

        {!recommendation ? (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">
              Tell us about yourself
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="age" className="form-label">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  {...register("age", {
                    required: "Age is required",
                    min: { value: 18, message: "Age must be at least 18" },
                    max: { value: 100, message: "Age must be less than 100" },
                  })}
                  className="form-input"
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="income" className="form-label">
                  Annual Income ($)
                </label>
                <input
                  id="income"
                  type="number"
                  {...register("income", {
                    required: "Income is required",
                    min: { value: 0, message: "Income must be positive" },
                  })}
                  className="form-input"
                  placeholder="Enter your annual income"
                />
                {errors.income && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.income.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="dependents" className="form-label">
                  Number of Dependents
                </label>
                <input
                  id="dependents"
                  type="number"
                  {...register("dependents", {
                    required: "Number of dependents is required",
                    min: { value: 0, message: "Dependents must be 0 or more" },
                  })}
                  className="form-input"
                  placeholder="Enter number of dependents"
                />
                {errors.dependents && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dependents.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="risk_tolerance" className="form-label">
                  Risk Tolerance
                </label>
                <select
                  id="risk_tolerance"
                  {...register("risk_tolerance", {
                    required: "Risk tolerance is required",
                  })}
                  className="form-input"
                >
                  <option value="">Select risk tolerance</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.risk_tolerance && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.risk_tolerance.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading
                  ? "Generating Recommendation..."
                  : "Get Recommendation"}
              </button>
            </form>
          </div>
        ) : (
          <div className="card">
            <h2 className="text-xl font-semibold mb-6">
              Your Personalized Recommendation
            </h2>
            <div className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  {recommendation.recommendation_type}
                </h3>
                <div className="text-2xl font-bold text-primary-800 mb-2">
                  {recommendation.coverage_amount}
                </div>
                <div className="text-primary-700">
                  Term: {recommendation.term_length}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Why this recommendation?
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {recommendation.explanation}
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">
                  Important Note
                </h4>
                <p className="text-yellow-700 text-sm">
                  This is a mock recommendation for demonstration purposes.
                  Please consult with a qualified insurance professional for
                  actual coverage decisions.
                </p>
              </div>
            </div>

            <button
              onClick={handleNewRecommendation}
              className="btn btn-secondary w-full mt-6"
            >
              Get Another Recommendation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
