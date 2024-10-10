ALTER TABLE "block-event" ALTER COLUMN "x_user_id" SET DATA TYPE uuid USING x_user_id::uuid;--> statement-breakpoint
