-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('pending', 'completed', 'failed');

-- CreateTable
CREATE TABLE "LibraryContribution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tier" TEXT,
    "status" "ContributionStatus" NOT NULL DEFAULT 'pending',
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LibraryContribution_status_idx" ON "LibraryContribution"("status");

-- CreateIndex
CREATE INDEX "LibraryContribution_createdAt_idx" ON "LibraryContribution"("createdAt");
