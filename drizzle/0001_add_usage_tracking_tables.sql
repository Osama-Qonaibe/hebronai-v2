-- Add 'images' to resource_type enum in usage table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid  
    WHERE t.typname = 'resource_type' AND e.enumlabel = 'images') THEN
    ALTER TYPE resource_type ADD VALUE 'images';
  END IF;
END $$;

-- Create image_generation table
CREATE TABLE IF NOT EXISTS image_generation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  image_url TEXT,
  cost NUMERIC(10, 4),
  status VARCHAR NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS image_generation_user_id_idx ON image_generation(user_id);
CREATE INDEX IF NOT EXISTS image_generation_created_at_idx ON image_generation(created_at);
CREATE INDEX IF NOT EXISTS image_generation_status_idx ON image_generation(status);

-- Create daily_usage_summary table
CREATE TABLE IF NOT EXISTS daily_usage_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  images_generated INTEGER NOT NULL DEFAULT 0,
  storage_used_gb NUMERIC(10, 2) NOT NULL DEFAULT 0,
  api_calls INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS daily_usage_user_id_idx ON daily_usage_summary(user_id);
CREATE INDEX IF NOT EXISTS daily_usage_date_idx ON daily_usage_summary(date);
