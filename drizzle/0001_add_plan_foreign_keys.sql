-- Add planId column to user table
ALTER TABLE "user" ADD COLUMN "plan_id" uuid;

-- Add foreign key constraint
ALTER TABLE "user" 
  ADD CONSTRAINT "user_plan_id_subscription_plan_id_fk" 
  FOREIGN KEY ("plan_id") 
  REFERENCES "subscription_plan"("id") 
  ON DELETE SET NULL 
  ON UPDATE NO ACTION;

-- Add requestedPlanId column to subscription_request table
ALTER TABLE "subscription_request" ADD COLUMN "requested_plan_id" uuid;

-- Add foreign key constraint
ALTER TABLE "subscription_request" 
  ADD CONSTRAINT "subscription_request_requested_plan_id_subscription_plan_id_fk" 
  FOREIGN KEY ("requested_plan_id") 
  REFERENCES "subscription_plan"("id") 
  ON DELETE SET NULL 
  ON UPDATE NO ACTION;

-- Add index for better query performance
CREATE INDEX "user_plan_id_idx" ON "user" ("plan_id");
CREATE INDEX "subscription_request_requested_plan_id_idx" ON "subscription_request" ("requested_plan_id");
