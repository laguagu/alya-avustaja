import '@/db/drizzle/envConfig';
import * as schema from "@/db/drizzle/schema";
import { users, NewUser } from "@/db/drizzle/schema";
// import { drizzle } from "drizzle-orm/neon-serverless";
// import { Pool } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'


const connectionString = process.env.DATABASE_URL;
console.log("Loaded connectionString:", connectionString); // Lisää tämä rivi

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
// const pool = new Pool({ connectionString });
// export const db = drizzle(pool, { schema });

export const insertUser = async (user: NewUser) => {
  console.log("connectionString", connectionString);
  return;
  // return db.insert(users).values(user).returning();
};
