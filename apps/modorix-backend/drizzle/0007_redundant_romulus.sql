ALTER TABLE "block-event" RENAME COLUMN "x_id" TO "x_user_id";--> statement-breakpoint
ALTER TABLE "block-event" ADD COLUMN "modorix_user_id" text NOT NULL;