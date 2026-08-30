-- CreateTable
CREATE TABLE "Week" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Week_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Week_moduleId_orderIndex_idx" ON "Week"("moduleId", "orderIndex");

-- AddForeignKey
ALTER TABLE "Week" ADD CONSTRAINT "Week_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: weekId starts nullable so existing ModuleStep rows aren't
-- broken until the backfill script assigns every row a Week; a follow-up
-- migration makes it NOT NULL and drops the old moduleId column.
ALTER TABLE "ModuleStep" ADD COLUMN "weekId" TEXT;

-- CreateIndex
CREATE INDEX "ModuleStep_weekId_orderIndex_idx" ON "ModuleStep"("weekId", "orderIndex");

-- AddForeignKey
ALTER TABLE "ModuleStep" ADD CONSTRAINT "ModuleStep_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week"("id") ON DELETE CASCADE ON UPDATE CASCADE;
