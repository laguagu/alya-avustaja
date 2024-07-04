import '@/db/drizzle/envConfig';
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/drizzle/schema.ts",
  out: "./db/drizzle/migration/",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
