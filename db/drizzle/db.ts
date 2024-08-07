import * as schema from "@/db/drizzle/schema";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { users } from "./migration/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// const pool = new Pool({ connectionString });
const pool = new Pool({
  connectionString,
  max: 20, // maksimi yhteyksien määrä
  idleTimeoutMillis: 30000, // kuinka kauan yhteyttä pidetään auki, kun se on idle
  connectionTimeoutMillis: 2000, // yhteyden muodostamisen aikakatkaisu
});

export const db = drizzle(pool, { schema });

export const insertUser = async (user: schema.NewUser) => {
  return db.insert(users).values(user).returning();
};
