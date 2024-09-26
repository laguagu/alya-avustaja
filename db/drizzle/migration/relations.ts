import { relations } from "drizzle-orm/relations";
import { users, sessions, chat_messages } from "./schema";

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  chat_messages: many(chat_messages),
}));

export const chat_messagesRelations = relations(chat_messages, ({ one }) => ({
  user: one(users, {
    fields: [chat_messages.user_id],
    references: [users.id],
  }),
}));
