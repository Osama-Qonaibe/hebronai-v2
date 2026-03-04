-- Migration: Add comprehensive usage tracking tables
-- Date: 2026-03-04
-- Description: Add tables for tracking usage, image generation, and daily summaries

-- Check if tables exist before creating
DO $$ 
BEGIN

-- 1. Create usage tracking table
IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'usage') THEN
    CREATE TABLE "usage" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "resource_type" varchar NOT NULL CHECK (resource_type IN ('tokens', 'api_calls', 'storage', 'images', 'documents')),
        "amount" numeric(15, 2) NOT NULL,
        "metadata" json,
        "period_start" timestamp NOT NULL,
        "period_end" timestamp NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    
    CREATE INDEX "usage_user_id_idx" ON "usage" ("user_id");
    CREATE INDEX "usage_period_idx" ON "usage" ("period_start", "period_end");
    CREATE INDEX "usage_resource_type_idx" ON "usage" ("resource_type");
    
    RAISE NOTICE 'Created table: usage';
ELSE
    RAISE NOTICE 'Table usage already exists, skipping...';
END IF;

-- 2. Create image generation tracking table
IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'image_generation') THEN
    CREATE TABLE "image_generation" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "prompt" text NOT NULL,
        "model" text NOT NULL,
        "image_url" text,
        "cost" numeric(10, 4),
        "status" varchar DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
        "metadata" json,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
    
    CREATE INDEX "image_generation_user_id_idx" ON "image_generation" ("user_id");
    CREATE INDEX "image_generation_created_at_idx" ON "image_generation" ("created_at");
    CREATE INDEX "image_generation_status_idx" ON "image_generation" ("status");
    
    RAISE NOTICE 'Created table: image_generation';
ELSE
    RAISE NOTICE 'Table image_generation already exists, skipping...';
END IF;

-- 3. Create daily usage summary table
IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'daily_usage_summary') THEN
    CREATE TABLE "daily_usage_summary" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "date" timestamp NOT NULL,
        "tokens_used" integer DEFAULT 0 NOT NULL,
        "images_generated" integer DEFAULT 0 NOT NULL,
        "storage_used_gb" numeric(10, 2) DEFAULT '0' NOT NULL,
        "api_calls" integer DEFAULT 0 NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE("user_id", "date")
    );
    
    CREATE INDEX "daily_usage_user_id_idx" ON "daily_usage_summary" ("user_id");
    CREATE INDEX "daily_usage_date_idx" ON "daily_usage_summary" ("date");
    
    RAISE NOTICE 'Created table: daily_usage_summary';
ELSE
    RAISE NOTICE 'Table daily_usage_summary already exists, skipping...';
END IF;

END $$;
