CREATE TABLE IF NOT EXISTS "used-user-email" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "used-user-email_email_unique" UNIQUE("email")
);
