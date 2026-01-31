-- Cleanup script for unused Plan-related tables and columns
-- Run this manually to remove Plan feature remnants from database
-- Safe to run multiple times (uses IF EXISTS)

-- Remove foreign key constraint if exists (safe approach)
DO $$ 
BEGIN
    -- Drop the foreign key constraint on user table if it exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_planId_Plan_id_fk'
    ) THEN
        ALTER TABLE "user" DROP CONSTRAINT "user_planId_Plan_id_fk";
    END IF;
END $$;

-- Remove planId column from user table
ALTER TABLE "user" DROP COLUMN IF EXISTS "planId";

-- Drop Plan table if exists (CASCADE will handle any remaining dependencies)
DROP TABLE IF EXISTS "Plan" CASCADE;

-- Verify cleanup
SELECT 'Cleanup completed successfully' as status;
