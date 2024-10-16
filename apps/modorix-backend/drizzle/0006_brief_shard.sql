CREATE TABLE IF NOT EXISTS "block_event_to_block_reasons" (
	"block_event_id" uuid NOT NULL,
	"blockReason_id" uuid NOT NULL,
	CONSTRAINT "block_event_to_block_reasons_block_event_id_blockReason_id_pk" PRIMARY KEY("block_event_id","blockReason_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "block_event_to_groups" (
	"block_event_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	CONSTRAINT "block_event_to_groups_block_event_id_group_id_pk" PRIMARY KEY("block_event_id","group_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "block-event" (
	"id" uuid PRIMARY KEY NOT NULL,
	"x_id" text NOT NULL,
	"blocked_at" date NOT NULL
);
--> statement-breakpoint
DROP TABLE "x_users_to_block_reasons";--> statement-breakpoint
DROP TABLE "x_users_to_groups";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block_event_to_block_reasons" ADD CONSTRAINT "block_event_to_block_reasons_block_event_id_block-event_id_fk" FOREIGN KEY ("block_event_id") REFERENCES "public"."block-event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block_event_to_block_reasons" ADD CONSTRAINT "block_event_to_block_reasons_blockReason_id_block-reason_id_fk" FOREIGN KEY ("blockReason_id") REFERENCES "public"."block-reason"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block_event_to_groups" ADD CONSTRAINT "block_event_to_groups_block_event_id_block-event_id_fk" FOREIGN KEY ("block_event_id") REFERENCES "public"."block-event"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "block_event_to_groups" ADD CONSTRAINT "block_event_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "x-user" DROP COLUMN IF EXISTS "blocked_at";--> statement-breakpoint
ALTER TABLE "x-user" DROP COLUMN IF EXISTS "blocking_modorix_user_ids";