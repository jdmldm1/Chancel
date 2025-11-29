-- Migration script to add Series and update Session model
-- This should be run before the Prisma schema changes are pushed

-- Step 1: Create new enums
DO $$ BEGIN
    CREATE TYPE "SessionVisibility" AS ENUM ('PUBLIC', 'PRIVATE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "JoinRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Create Series table
CREATE TABLE IF NOT EXISTS "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "leaderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- Step 3: Add new columns to Session table
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "seriesId" TEXT;
ALTER TABLE "Session" ADD COLUMN IF NOT EXISTS "visibility" "SessionVisibility" NOT NULL DEFAULT 'PUBLIC';

-- Step 4: Migrate existing data - copy scheduledDate to startDate and set endDate to 7 days later
UPDATE "Session"
SET "startDate" = "scheduledDate",
    "endDate" = "scheduledDate" + INTERVAL '7 days'
WHERE "startDate" IS NULL;

-- Step 5: Make startDate and endDate NOT NULL now that data is populated
ALTER TABLE "Session" ALTER COLUMN "startDate" SET NOT NULL;
ALTER TABLE "Session" ALTER COLUMN "endDate" SET NOT NULL;

-- Step 6: Create JoinRequest table
CREATE TABLE IF NOT EXISTS "JoinRequest" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "status" "JoinRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JoinRequest_pkey" PRIMARY KEY ("id")
);

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS "Series_leaderId_idx" ON "Series"("leaderId");
CREATE INDEX IF NOT EXISTS "Session_seriesId_idx" ON "Session"("seriesId");
CREATE INDEX IF NOT EXISTS "Session_startDate_idx" ON "Session"("startDate");
CREATE INDEX IF NOT EXISTS "Session_endDate_idx" ON "Session"("endDate");
CREATE INDEX IF NOT EXISTS "Session_visibility_idx" ON "Session"("visibility");
CREATE INDEX IF NOT EXISTS "JoinRequest_sessionId_idx" ON "JoinRequest"("sessionId");
CREATE INDEX IF NOT EXISTS "JoinRequest_fromId_idx" ON "JoinRequest"("fromId");
CREATE INDEX IF NOT EXISTS "JoinRequest_toId_idx" ON "JoinRequest"("toId");
CREATE INDEX IF NOT EXISTS "JoinRequest_status_idx" ON "JoinRequest"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "JoinRequest_sessionId_toId_key" ON "JoinRequest"("sessionId", "toId");

-- Step 8: Add foreign key constraints
DO $$ BEGIN
    ALTER TABLE "Series" ADD CONSTRAINT "Series_leaderId_fkey"
        FOREIGN KEY ("leaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Session" ADD CONSTRAINT "Session_seriesId_fkey"
        FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_sessionId_fkey"
        FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_fromId_fkey"
        FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "JoinRequest" ADD CONSTRAINT "JoinRequest_toId_fkey"
        FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
