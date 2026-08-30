-- AlterTable: every ModuleStep now has a real weekId (backfilled) — make it
-- required and drop the old direct-to-Module relation entirely.
ALTER TABLE "ModuleStep" ALTER COLUMN "weekId" SET NOT NULL;

-- DropForeignKey
ALTER TABLE "ModuleStep" DROP CONSTRAINT "ModuleStep_moduleId_fkey";

-- DropIndex
DROP INDEX "ModuleStep_moduleId_orderIndex_idx";

-- AlterTable
ALTER TABLE "ModuleStep" DROP COLUMN "moduleId";
