-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firstTimeStudying" TEXT,
ADD COLUMN     "primaryGoal" TEXT;

-- AlterTable
ALTER TABLE "VerificationToken" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
