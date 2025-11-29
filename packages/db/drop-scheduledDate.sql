-- Drop the old scheduledDate column and its index
DROP INDEX IF EXISTS "Session_scheduledDate_idx";
ALTER TABLE "Session" DROP COLUMN IF EXISTS "scheduledDate";
