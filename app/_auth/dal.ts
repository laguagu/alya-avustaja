import { ChatMessage } from "@/data/types";
import { db } from "@/db/drizzle/db";
import {
  chatFeedback,
  chatMessages,
  NewChatFeedback,
  NewChatMessage,
  NewUser,
  users,
} from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";
import "server-only";
import { verifySession } from "./sessions";

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),

      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    const user = data[0];

    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});

export const insertUser = async (user: NewUser) => {
  return db.insert(users).values(user).returning();
};

export const getAllUsers = async () => {
  return db.select().from(users);
};

// Uusi funktio chat-viestin lisäämiseksi
export const insertChatMessage = async (message: ChatMessage) => {
  const newMessage: NewChatMessage = {
    userId: message.userId,
    role: message.role,
    content: message.content,
    created_at: new Date(message.createdAt || new Date()),
  };

  return db.insert(chatMessages).values(newMessage).returning();
};

export const insertChatFeedback = async (feedback: NewChatFeedback) => {
  return db.insert(chatFeedback).values(feedback).returning();
};
