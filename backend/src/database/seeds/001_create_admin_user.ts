import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex("users").del();

  // Insert admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await knex("users").insert([
    {
      email: "admin@insurance.com",
      password_hash: hashedPassword,
      role: "admin",
    },
  ]);
}
