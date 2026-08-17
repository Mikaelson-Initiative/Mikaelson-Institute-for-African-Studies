-- CreateTable
CREATE TABLE "CohortEvent" (
    "id" TEXT NOT NULL,
    "cohortId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "meetingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CohortEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CohortEvent_cohortId_startsAt_idx" ON "CohortEvent"("cohortId", "startsAt");

-- AddForeignKey
ALTER TABLE "CohortEvent" ADD CONSTRAINT "CohortEvent_cohortId_fkey" FOREIGN KEY ("cohortId") REFERENCES "Cohort"("id") ON DELETE CASCADE ON UPDATE CASCADE;
