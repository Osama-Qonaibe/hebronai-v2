CREATE TABLE IF NOT EXISTS "plan" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"monthly_price" integer DEFAULT 0 NOT NULL,
	"yearly_price" integer DEFAULT 0 NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"features" json NOT NULL,
	"description" text,
	"icon" text,
	"badge" text,
	"color" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "plan_name_unique" UNIQUE("name"),
	CONSTRAINT "plan_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "user_subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"status" varchar DEFAULT 'active' NOT NULL,
	"billing_cycle" varchar NOT NULL,
	"start_date" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"end_date" timestamp,
	"cancelled_at" timestamp,
	"payment_provider" text,
	"subscription_id" text,
	"customer_id" text,
	"current_usage" json DEFAULT '{"chatsThisMonth":0,"agentsCreated":0,"workflowsCreated":0,"mcpServersAdded":0,"storageUsedMB":0}'::json,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscription_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"action" varchar NOT NULL,
	"from_plan_id" uuid,
	"to_plan_id" uuid,
	"metadata" json,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_from_plan_id_plan_id_fk" FOREIGN KEY ("from_plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription_history" ADD CONSTRAINT "subscription_history_to_plan_id_plan_id_fk" FOREIGN KEY ("to_plan_id") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "plan_slug_idx" ON "plan" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "plan_active_idx" ON "plan" USING btree ("is_active");
CREATE INDEX IF NOT EXISTS "user_subscription_user_id_idx" ON "user_subscription" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "user_subscription_status_idx" ON "user_subscription" USING btree ("status");
CREATE INDEX IF NOT EXISTS "user_subscription_plan_id_idx" ON "user_subscription" USING btree ("plan_id");
CREATE INDEX IF NOT EXISTS "subscription_history_user_id_idx" ON "subscription_history" USING btree ("user_id");
CREATE INDEX IF NOT EXISTS "subscription_history_action_idx" ON "subscription_history" USING btree ("action");