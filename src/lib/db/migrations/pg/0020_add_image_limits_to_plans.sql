-- Migration: Add image limits to subscription plans
-- Date: 2026-03-05
-- Description: Updates all existing subscription plans to include image limits in their limits JSON field

-- Update all existing plans to add images limits based on their plan type
UPDATE subscription_plan
SET 
  limits = jsonb_set(
    limits::jsonb,
    '{images}',
    CASE 
      WHEN slug = 'free' THEN '{"maxPerDay": 0, "maxPerMonth": 0}'::jsonb
      WHEN slug = 'basic' THEN '{"maxPerDay": 3, "maxPerMonth": 90}'::jsonb
      WHEN slug = 'pro' THEN '{"maxPerDay": 6, "maxPerMonth": 180}'::jsonb
      WHEN slug = 'enterprise' THEN '{"maxPerDay": -1, "maxPerMonth": -1}'::jsonb
      ELSE '{"maxPerDay": 0, "maxPerMonth": 0}'::jsonb
    END
  ),
  updated_at = NOW()
WHERE limits::jsonb -> 'images' IS NULL;

-- Log the migration
INSERT INTO _drizzle_migrations (hash, created_at)
VALUES ('add_image_limits_to_plans_2026_03_05', NOW())
ON CONFLICT DO NOTHING;
