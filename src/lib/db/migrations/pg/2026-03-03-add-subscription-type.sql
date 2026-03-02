-- Add subscription_type field to subscription_request table
ALTER TABLE subscription_request
ADD COLUMN IF NOT EXISTS subscription_type VARCHAR(10) NOT NULL DEFAULT 'monthly' CHECK (subscription_type IN ('monthly', 'yearly'));

-- Add comment
COMMENT ON COLUMN subscription_request.subscription_type IS 'Type of subscription: monthly or yearly';
