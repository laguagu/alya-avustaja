import {
  serial,
  text,
  pgTable,
  uniqueIndex,
  integer,
  timestamp,
  time,
} from "drizzle-orm/pg-core";
import { InferInsertModel } from "drizzle-orm";
import { pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
  }
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
  .notNull(),  // Lisää tämä rivi
  role: text("role").notNull(),
  content: text("content").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`timezone('utc', now())`)
    .notNull(),
});

export type NewUser = InferInsertModel<typeof users>;
export type NewSession = InferInsertModel<typeof sessions>;
export type NewChatMessage = InferInsertModel<typeof chatMessages>;
