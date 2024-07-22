import * as schema from "@/db/drizzle/schema";
import {
  users,
  NewUser,
  chatMessages,
  NewChatMessage,
} from "@/db/drizzle/schema";
// Edge runtime virheen korjaukseen
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { ChatMessage } from "@/data/types";
// import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
// export const client = postgres(connectionString, { prepare: false });
// export const db = drizzle(client, { schema });

// Edge runtime virheen korjaukseen
const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

export const insertUser = async (user: NewUser) => {
  console.log("connectionString", connectionString);
  return db.insert(users).values(user).returning();
};

export const getAllUsers = async () => {
  return db.select().from(users);
};

// Uusi funktio chat-viestin lisäämiseksi
export const insertChatMessage = async (message: ChatMessage) => {
  const newMessage: NewChatMessage = {
    role: message.role,
    content: message.content,
    created_at: new Date(message.createdAt || new Date()),
  };

  return db.insert(chatMessages).values(newMessage).returning();
};
