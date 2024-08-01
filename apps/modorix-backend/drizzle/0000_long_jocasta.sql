CREATE TABLE IF NOT EXISTS "x-user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"x_id" text NOT NULL,
	"x_username" text NOT NULL,
	"blocked_at" date NOT NULL
);
