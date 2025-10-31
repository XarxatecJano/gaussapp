import { Pool } from "pg";

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: {
    rejectUnauthorized: boolean;
  };
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "gaussdb",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
};

// SSL para conexiones remotas (Render, etc.)
if (
  process.env.DB_HOST?.includes("render.com") ||
  process.env.NODE_ENV === "production"
) {
  config.ssl = {
    rejectUnauthorized: false,
  };
}

export const pool = new Pool(config);
export default config;
