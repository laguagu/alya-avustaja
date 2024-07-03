import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/drizzle/schema.ts",
  out: "./db/drizzle/migration/",
  dbCredentials: {
    user: process.env.PGUSER || "",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "",
    host: process.env.PGHOST || "",
    port: Number(process.env.PGPORT) || 5432,
    ssl: false, // Lisää tämä rivi estääksesi SSL-yhteyden
  },
});
