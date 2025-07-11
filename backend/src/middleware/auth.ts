import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const decoded = await AuthService.verifyToken(token);
    if (!decoded) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token verification failed" });
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
};
