-- Add duration field to subscription_plan table
ALTER TABLE subscription_plan
ADD COLUMN IF NOT EXISTS duration_value INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS duration_unit VARCHAR(10) NOT NULL DEFAULT 'months' CHECK (duration_unit IN ('days', 'months', 'years'));

-- Add comment
COMMENT ON COLUMN subscription_plan.duration_value IS 'Numeric value for subscription duration';
COMMENT ON COLUMN subscription_plan.duration_unit IS 'Unit for subscription duration: days, months, or years';
