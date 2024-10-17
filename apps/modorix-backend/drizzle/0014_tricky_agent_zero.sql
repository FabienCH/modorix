ALTER TABLE "group" ADD COLUMN "is_joined_by" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "group" DROP COLUMN IF EXISTS "is_joined";