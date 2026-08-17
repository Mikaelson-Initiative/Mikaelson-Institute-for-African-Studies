-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "UserProgress" DROP CONSTRAINT "UserProgress_userId_fkey";

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "audioUrl",
DROP COLUMN "contentMarkdown",
DROP COLUMN "syllabusFileName",
DROP COLUMN "syllabusUrl",
DROP COLUMN "videoId",
DROP COLUMN "videoProvider",
DROP COLUMN "videoUrl";

-- DropTable
DROP TABLE "UserProgress";
