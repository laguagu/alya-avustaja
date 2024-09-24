import { InferInsertModel, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
    role: userRole("role").default("user").notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  },
);

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey().notNull(), // Lisää tämä rivi
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(), // Lisää tämä rivi
  role: text("role").notNull(),
  content: jsonb("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
});

export const chatFeedback = pgTable("chat_feedback", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  isPositive: boolean("is_positive").notNull(),
  content: text("content").notNull(),
  feedbackDetails: text("feedback_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type NewChatFeedback = InferInsertModel<typeof chatFeedback>;
export type NewUser = InferInsertModel<typeof users>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewChatMessage = InferInsertModel<typeof chatMessages>;
