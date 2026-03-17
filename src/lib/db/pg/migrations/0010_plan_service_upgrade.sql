-- Migration: 0010_plan_service_upgrade
-- Safe: ADD COLUMN IF NOT EXISTS only, no data loss

ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "stripe_customer_id" text,
  ADD COLUMN IF NOT EXISTS "stripe_subscription_id" text;

ALTER TABLE "subscription_plan"
  ADD COLUMN IF NOT EXISTS "payment_type" varchar(10) NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS "stripe_price_id_monthly" text,
  ADD COLUMN IF NOT EXISTS "stripe_price_id_yearly" text;

ALTER TABLE "user"
  ALTER COLUMN "plan" TYPE text;
