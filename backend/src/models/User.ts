import { Model } from "objection";

export class User extends Model {
  static tableName = "users";

  id!: number;
  email!: string;
  password_hash!: string;
  role!: string;
  created_at!: Date;
  updated_at!: Date;

  static jsonSchema = {
    type: "object",
    required: ["email", "password_hash"],
    properties: {
      id: { type: "integer" },
      email: { type: "string", format: "email" },
      password_hash: { type: "string" },
      role: { type: "string", enum: ["user", "admin"] },
      created_at: { type: "string", format: "date-time" },
      updated_at: { type: "string", format: "date-time" },
    },
  };
}
