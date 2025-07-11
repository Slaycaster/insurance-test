import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { User } from "../models/User";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: {
    id: number;
    email: string;
    role: string;
  };
  token: string;
}

export class AuthService {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "fallback-secret";
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

  static async login(
    credentials: LoginCredentials
  ): Promise<AuthResult | null> {
    const { email, password } = credentials;

    try {
      // Find user by email
      const user = await User.query().where("email", email).first();
      if (!user) {
        return null;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isPasswordValid) {
        return null;
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        this.JWT_SECRET,
        { expiresIn: this.JWT_EXPIRES_IN } as SignOptions
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
