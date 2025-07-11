import path from "path";
import { Knex } from "knex";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME || "insurance_db",
      user: process.env.DB_USER || "insurance_user",
      password: process.env.DB_PASSWORD || "insurance_pass",
    },
    migrations: {
      directory: path.join(__dirname, "database/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "database/seeds"),
    },
  },
  production: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      directory: path.join(__dirname, "database/migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "database/seeds"),
    },
  },
};

export default config;
