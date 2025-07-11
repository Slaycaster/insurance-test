"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import {
  getAllRecommendations,
  verifyToken,
  RecommendationRecord,
} from "@/lib/api";

export default function AdminDashboard() {
  const [recommendations, setRecommendations] = useState<
    RecommendationRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verifyToken();
        setIsAuthenticated(true);
        await loadRecommendations();
      } catch (error) {
        toast.error("Please login to access the admin dashboard");
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [router]);

  const loadRecommendations = async () => {
    try {
      const data = await getAllRecommendations();
      setRecommendations(data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to load recommendations"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("authToken");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View all life insurance recommendations submitted by users
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              {isLoading ? (
                <div className="bg-white px-6 py-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    Loading recommendations...
                  </p>
                </div>
              ) : recommendations.length === 0 ? (
                <div className="bg-white px-6 py-8 text-center">
                  <p className="text-gray-500">No recommendations found.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recommendation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recommendations.map((recommendation) => (
                      <tr key={recommendation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(recommendation.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              Age: {recommendation.age}
                            </div>
                            <div className="text-gray-500">
                              Income: {formatCurrency(recommendation.income)}
                            </div>
                            <div className="text-gray-500">
                              Dependents: {recommendation.dependents}
                            </div>
                            <div className="text-gray-500">
                              Risk: {recommendation.risk_tolerance}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div>
                            <div className="font-medium">
                              {recommendation.recommendation_type}
                            </div>
                            <div className="text-gray-500">
                              {recommendation.coverage_amount}
                            </div>
                            <div className="text-gray-500">
                              {recommendation.term_length}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recommendation.ip_address || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {recommendations.length}
                </div>
                <div className="text-sm text-blue-600">
                  Total Recommendations
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {
                    recommendations.filter(
                      (r) => r.recommendation_type === "Term Life"
                    ).length
                  }
                </div>
                <div className="text-sm text-green-600">
                  Term Life Recommendations
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    recommendations.filter(
                      (r) => r.recommendation_type === "Whole Life"
                    ).length
                  }
                </div>
                <div className="text-sm text-purple-600">
                  Whole Life Recommendations
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
