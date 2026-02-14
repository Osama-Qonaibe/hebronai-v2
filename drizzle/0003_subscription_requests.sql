-- Create subscription_request table
CREATE TABLE IF NOT EXISTS "subscription_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"requested_plan" varchar NOT NULL,
	"payment_method" varchar NOT NULL,
	"amount" numeric(10, 2),
	"currency" varchar(3) DEFAULT 'USD',
	"status" varchar DEFAULT 'pending' NOT NULL,
	"proof_image_url" text,
	"transaction_id" text,
	"stripe_session_id" text,
	"notes" text,
	"admin_notes" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"approved_by" uuid,
	"approved_at" timestamp,
	CONSTRAINT "subscription_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "subscription_request_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "subscription_request_user_id_idx" ON "subscription_request" ("user_id");
CREATE INDEX IF NOT EXISTS "subscription_request_status_idx" ON "subscription_request" ("status");

-- Add CHECK constraints for enums
ALTER TABLE "subscription_request" ADD CONSTRAINT "subscription_request_requested_plan_check" 
	CHECK ("requested_plan" IN ('free', 'basic', 'pro', 'enterprise'));

ALTER TABLE "subscription_request" ADD CONSTRAINT "subscription_request_payment_method_check" 
	CHECK ("payment_method" IN ('stripe', 'paypal', 'bank_transfer', 'manual'));

ALTER TABLE "subscription_request" ADD CONSTRAINT "subscription_request_status_check" 
	CHECK ("status" IN ('pending', 'approved', 'rejected', 'processing'));
