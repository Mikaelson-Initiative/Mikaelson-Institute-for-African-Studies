-- AlterTable
ALTER TABLE "TeamApplication"
  DROP COLUMN "portfolioUrl",
  ADD COLUMN "customRole" TEXT,
  ADD COLUMN "availability" TEXT NOT NULL,
  ADD COLUMN "hoursPerWeek" INTEGER NOT NULL,
  ADD COLUMN "volunteeredBefore" BOOLEAN NOT NULL,
  ADD COLUMN "linkedinUrl" TEXT NOT NULL,
  ADD COLUMN "cvUrl" TEXT NOT NULL,
  ADD COLUMN "cvFileName" TEXT NOT NULL;
