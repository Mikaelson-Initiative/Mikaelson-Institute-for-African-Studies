-- CreateTable
CREATE TABLE "CohortDonation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tier" TEXT,
    "status" "ContributionStatus" NOT NULL DEFAULT 'pending',
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortDonation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CohortDonation_status_idx" ON "CohortDonation"("status");

-- CreateIndex
CREATE INDEX "CohortDonation_userId_idx" ON "CohortDonation"("userId");

-- AddForeignKey
ALTER TABLE "CohortDonation" ADD CONSTRAINT "CohortDonation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
