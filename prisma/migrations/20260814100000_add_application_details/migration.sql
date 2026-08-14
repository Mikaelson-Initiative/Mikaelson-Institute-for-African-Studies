-- Additive only: all new columns nullable, no backfill needed (no prior
-- data exists for these fields).
ALTER TABLE "CohortApplication" ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "stateOfOrigin" TEXT;
