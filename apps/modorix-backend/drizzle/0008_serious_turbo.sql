ALTER TABLE "block-event" ALTER COLUMN "x_user_id" SET DATA TYPE uuid USING x_user_id::uuid;--> statement-breakpoint
ALTER TABLE "block-event" ALTER COLUMN "modorix_user_id" SET DATA TYPE uuid USING modorix_user_id::uuid;