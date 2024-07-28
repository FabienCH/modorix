CREATE TABLE IF NOT EXISTS "x_users_to_block_reasons" (
	"x_user_id" uuid NOT NULL,
	"blockReason_id" uuid NOT NULL,
	CONSTRAINT "x_users_to_block_reasons_x_user_id_blockReason_id_pk" PRIMARY KEY("x_user_id","blockReason_id")
);
--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "is_joined" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "x-user" ADD COLUMN "blocking_modorix_user_ids" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "x-user" ADD COLUMN "block_queue_modorix_user_ids" text[] NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "x_users_to_block_reasons" ADD CONSTRAINT "x_users_to_block_reasons_x_user_id_x-user_id_fk" FOREIGN KEY ("x_user_id") REFERENCES "public"."x-user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "x_users_to_block_reasons" ADD CONSTRAINT "x_users_to_block_reasons_blockReason_id_block-reason_id_fk" FOREIGN KEY ("blockReason_id") REFERENCES "public"."block-reason"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "x-user" DROP COLUMN IF EXISTS "block_reason_ids";