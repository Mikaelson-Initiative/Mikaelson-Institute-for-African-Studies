-- AlterTable: add columns nullable first so existing rows (real user data)
-- don't get rejected, then backfill, then enforce NOT NULL.
ALTER TABLE "CohortApplication" ADD COLUMN     "firstTimeStudying" TEXT,
ADD COLUMN     "primaryGoal" TEXT,
ADD COLUMN     "reviewed" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: this app's one existing row already carries these exact answers
-- under "about"/"motivation" from an earlier migration (they were originally
-- the fixed-choice answers before a prior rewrite moved them to open text).
-- Copying them forward here is not a fabrication — it's the same real data.
UPDATE "CohortApplication" SET "firstTimeStudying" = "about", "primaryGoal" = "motivation"
WHERE "firstTimeStudying" IS NULL;

-- AlterTable
ALTER TABLE "CohortApplication" ALTER COLUMN "firstTimeStudying" SET NOT NULL,
ALTER COLUMN "primaryGoal" SET NOT NULL;
