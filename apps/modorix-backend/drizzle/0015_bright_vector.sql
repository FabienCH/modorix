ALTER TABLE "group" ALTER COLUMN "is_joined_by" DROP DEFAULT;
ALTER TABLE "group" ALTER COLUMN "is_joined_by" SET DATA TYPE uuid[] USING is_joined_by::uuid[];
ALTER TABLE "group" ALTER COLUMN "is_joined_by" SET DEFAULT '{}';
