-- CreateTable
CREATE TABLE "CohortApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CohortApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CohortApplication_userId_key" ON "CohortApplication"("userId");

-- AddForeignKey
ALTER TABLE "CohortApplication" ADD CONSTRAINT "CohortApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Preserve any existing onboarding answers (real user data from testing,
-- not fabricated) as a best-effort CohortApplication row before dropping
-- the old fixed-choice columns they came from.
INSERT INTO "CohortApplication" ("id", "userId", "about", "motivation", "createdAt")
SELECT 'migrated_' || "id", "id", COALESCE("firstTimeStudying", ''), COALESCE("primaryGoal", ''), CURRENT_TIMESTAMP
FROM "User"
WHERE "firstTimeStudying" IS NOT NULL OR "primaryGoal" IS NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstTimeStudying",
DROP COLUMN "primaryGoal";
