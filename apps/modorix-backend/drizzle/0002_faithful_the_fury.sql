CREATE TABLE IF NOT EXISTS "block-reason" (
	"id" uuid PRIMARY KEY NOT NULL,
	"label" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "group" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_joined" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "x_users_to_groups" (
	"x_user_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	CONSTRAINT "x_users_to_groups_x_user_id_group_id_pk" PRIMARY KEY("x_user_id","group_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "x_users_to_groups" ADD CONSTRAINT "x_users_to_groups_x_user_id_x-user_id_fk" FOREIGN KEY ("x_user_id") REFERENCES "public"."x-user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "x_users_to_groups" ADD CONSTRAINT "x_users_to_groups_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
