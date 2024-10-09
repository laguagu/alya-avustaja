CREATE TABLE IF NOT EXISTS "issue_feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"issue_id" integer NOT NULL,
	"instruction" text NOT NULL,
	"is_positive" boolean NOT NULL,
	"feedback_details" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
