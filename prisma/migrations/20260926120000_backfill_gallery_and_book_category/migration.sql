-- Backfills schema changes from commit 59bd36b ("Add admin CRUD for Team,
-- Partners, Books, and Gallery"), which added GalleryItem and
-- BookRecommendation.category to schema.prisma without a migration. A
-- database built purely from migrations was missing both, so /library/books,
-- /library/gallery, and the admin Books/Gallery routes failed against it.
--
-- Every statement is guarded (IF [NOT] EXISTS) because databases that were
-- synced from the schema directly (e.g. via `prisma db push`) may already have
-- some or all of this — the migration must be a no-op there, not fail.

-- AlterTable
ALTER TABLE "BookRecommendation" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'Book';

-- DropIndex
DROP INDEX IF EXISTS "BookRecommendation_genre_sortOrder_idx";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "BookRecommendation_category_genre_sortOrder_idx" ON "BookRecommendation"("category", "genre", "sortOrder");

-- CreateTable
CREATE TABLE IF NOT EXISTS "GalleryItem" (
    "id" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "GalleryItem_sortOrder_idx" ON "GalleryItem"("sortOrder");
