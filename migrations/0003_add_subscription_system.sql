-- Migration: Add subscription system columns to User table
-- This migration ensures all subscription-related columns exist

-- Add plan column if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user' AND column_name = 'plan'
  ) THEN
    ALTER TABLE "user" 
    ADD COLUMN "plan" VARCHAR NOT NULL DEFAULT 'free' 
    CHECK ("plan" IN ('free', 'basic', 'pro', 'enterprise'));
  END IF;
END $$;

-- Add planStatus column if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user' AND column_name = 'plan_status'
  ) THEN
    ALTER TABLE "user" 
    ADD COLUMN "plan_status" VARCHAR NOT NULL DEFAULT 'trial' 
    CHECK ("plan_status" IN ('trial', 'active', 'expired'));
  END IF;
END $$;

-- Add planExpiresAt column if not exists
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user' AND column_name = 'plan_expires_at'
  ) THEN
    ALTER TABLE "user" 
    ADD COLUMN "plan_expires_at" TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days');
  END IF;
END $$;

-- Create subscription_request table if not exists
CREATE TABLE IF NOT EXISTS "subscription_request" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "requested_plan" VARCHAR NOT NULL CHECK ("requested_plan" IN ('free', 'basic', 'pro', 'enterprise')),
  "payment_method" VARCHAR NOT NULL CHECK ("payment_method" IN ('stripe', 'paypal', 'bank_transfer', 'manual')),
  "amount" NUMERIC(10, 2),
  "currency" VARCHAR(3) DEFAULT 'USD',
  "status" VARCHAR NOT NULL DEFAULT 'pending' CHECK ("status" IN ('pending', 'approved', 'rejected', 'processing')),
  "proof_image_url" TEXT,
  "transaction_id" TEXT,
  "stripe_session_id" TEXT,
  "notes" TEXT,
  "admin_notes" TEXT,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "approved_by" UUID REFERENCES "user"("id"),
  "approved_at" TIMESTAMP
);

-- Create indexes for subscription_request if not exists
CREATE INDEX IF NOT EXISTS "subscription_request_user_id_idx" ON "subscription_request"("user_id");
CREATE INDEX IF NOT EXISTS "subscription_request_status_idx" ON "subscription_request"("status");

-- Update existing users to have proper default values
UPDATE "user" 
SET 
  "plan" = COALESCE("plan", 'free'),
  "plan_status" = COALESCE("plan_status", 'trial'),
  "plan_expires_at" = COALESCE("plan_expires_at", CURRENT_TIMESTAMP + INTERVAL '30 days')
WHERE "plan" IS NULL OR "plan_status" IS NULL OR "plan_expires_at" IS NULL;

-- Set admin users to enterprise plan with active status
UPDATE "user" 
SET 
  "plan" = 'enterprise',
  "plan_status" = 'active',
  "plan_expires_at" = CURRENT_TIMESTAMP + INTERVAL '10 years'
WHERE "role" = 'admin';
