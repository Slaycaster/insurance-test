import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.API_URL || "http://localhost:3001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("authToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

export interface RecommendationRequest {
  age: number;
  income: number;
  dependents: number;
  risk_tolerance: "low" | "medium" | "high";
}

export interface RecommendationResponse {
  id: number;
  recommendation_type: string;
  coverage_amount: string;
  term_length: string;
  explanation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  token: string;
}

export interface RecommendationRecord {
  id: number;
  age: number;
  income: number;
  dependents: number;
  risk_tolerance: string;
  recommendation_type: string;
  coverage_amount: string;
  term_length: string;
  explanation: string;
  ip_address: string;
  created_at: string;
  updated_at: string;
}

// API functions
export const getRecommendation = async (
  data: RecommendationRequest
): Promise<RecommendationResponse> => {
  const response = await api.post("/recommendations", data);
  return response.data.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data.data;
};

export const verifyToken = async (): Promise<any> => {
  const response = await api.get("/auth/verify");
  return response.data.data;
};

export const getAllRecommendations = async (): Promise<
  RecommendationRecord[]
> => {
  const response = await api.get("/recommendations");
  return response.data.data;
};

export default api;
