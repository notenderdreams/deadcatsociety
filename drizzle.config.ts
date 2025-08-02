// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

// Load Next.js local environment variables
dotenvConfig({ path: resolve(process.cwd(), ".env.local") });

const config: Config = {
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};

export default config;
