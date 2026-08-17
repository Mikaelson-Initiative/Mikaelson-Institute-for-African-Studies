-- CreateEnum
CREATE TYPE "CohortApplicationStatus" AS ENUM ('pending', 'admitted', 'rejected', 'waitlisted');

-- AlterTable
ALTER TABLE "CohortApplication" ADD COLUMN     "cohortId" TEXT,
ADD COLUMN     "status" "CohortApplicationStatus" NOT NULL DEFAULT 'pending';

-- CreateTable
CREATE TABLE "Cohort" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cohort_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "contentMarkdown" TEXT NOT NULL,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "syllabusUrl" TEXT,
    "syllabusFileName" TEXT,
    "unlockDate" TIMESTAMP(3) NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Module_cohortId_orderIndex_idx" ON "Module"("cohortId", "orderIndex");

-- CreateIndex
CREATE INDEX "UserProgress_userId_idx" ON "UserProgress"("userId");

-- CreateIndex
CREATE INDEX "UserProgress_moduleId_idx" ON "UserProgress"("moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_moduleId_key" ON "UserProgress"("userId", "moduleId");

-- CreateIndex
CREATE INDEX "CohortApplication_status_idx" ON "CohortApplication"("status");

-- CreateIndex
CREATE INDEX "CohortApplication_cohortId_idx" ON "CohortApplication"("cohortId");

-- AddForeignKey
ALTER TABLE "CohortApplication" ADD CONSTRAINT "CohortApplication_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProgress" ADD CONSTRAINT "UserProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Data backfill: seed a default "Cohort 01" row and point every existing
-- CohortApplication at it. status stays at its default 'pending' for all of
-- them — nobody is auto-admitted, that's a staff decision made through the
-- admin dashboard's new status/cohort selects, after this ships.
INSERT INTO "Cohort" ("id", "title", "description", "startDate", "endDate", "createdAt", "updatedAt")
VALUES ('cohort-01-seed', 'Cohort 01', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

UPDATE "CohortApplication" SET "cohortId" = 'cohort-01-seed' WHERE "cohortId" IS NULL;

