import { pgTable, uniqueIndex, unique, pgEnum, serial, text, bigserial, jsonb, vector, foreignKey, integer, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const aal_level = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factor_status = pgEnum("factor_status", ['unverified', 'verified'])
export const factor_type = pgEnum("factor_type", ['totp', 'webauthn'])
export const one_time_token_type = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])
export const key_status = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const user_role = pgEnum("user_role", ['user', 'admin'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const equality_op = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])


export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	email: text("email").notNull(),
	password: text("password").notNull(),
	role: user_role("role").default('user').notNull(),
},
(table) => {
	return {
		unique_idx: uniqueIndex("unique_idx").using("btree", table.email),
		users_email_unique: unique("users_email_unique").on(table.email),
	}
});

export const piiroinen_chairs = pgTable("piiroinen_chairs", {
	id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
	content: text("content"),
	metadata: jsonb("metadata"),
	embedding: vector("embedding", { dimensions: 1536 }),
});

export const sessions = pgTable("sessions", {
	id: serial("id").primaryKey().notNull(),
	userId: integer("userId").notNull().references(() => users.id),
	expires_at: timestamp("expires_at", { mode: 'string' }).notNull(),
});