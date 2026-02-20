-- Migration: Add limits.images to existing SubscriptionPlan records
-- Date: 2026-02-21
-- Description: Updates all existing plans to include default image generation limits
-- Author: System Migration

-- Start transaction
BEGIN;

-- Backup current state (optional - for safety)
-- CREATE TABLE IF NOT EXISTS "SubscriptionPlan_backup_20260221" AS 
-- SELECT * FROM "SubscriptionPlan";

-- Update all plans that don't have limits.images
-- This uses PostgreSQL's jsonb_set to safely add the images key
UPDATE "SubscriptionPlan"
SET "limits" = jsonb_set(
  COALESCE("limits", '{}'::jsonb),
  '{images}',
  CASE 
    -- Enterprise/Unlimited plans get higher limits
    WHEN slug LIKE '%enterprise%' OR slug LIKE '%unlimited%' THEN
      '{"maxPerDay": 200, "maxPerMonth": 2000, "maxResolution": "1792x1024"}'::jsonb
    -- Pro/Premium plans get medium limits
    WHEN slug LIKE '%pro%' OR slug LIKE '%premium%' THEN
      '{"maxPerDay": 50, "maxPerMonth": 500, "maxResolution": "1792x1024"}'::jsonb
    -- Free/Basic plans get lower limits
    WHEN slug LIKE '%free%' OR slug LIKE '%basic%' THEN
      '{"maxPerDay": 5, "maxPerMonth": 50, "maxResolution": "512x512"}'::jsonb
    -- Default for all others
    ELSE
      '{"maxPerDay": 10, "maxPerMonth": 100, "maxResolution": "1024x1024"}'::jsonb
  END
)
WHERE "limits" IS NULL 
   OR NOT ("limits" ? 'images');

-- Verify the update
SELECT 
  id, 
  name, 
  slug,
  "limits"->'images' as image_limits,
  "updatedAt"
FROM "SubscriptionPlan"
ORDER BY "createdAt";

-- Commit transaction
COMMIT;

-- Success message
-- SELECT 'Migration completed successfully! Image limits added to all plans.' as status;
