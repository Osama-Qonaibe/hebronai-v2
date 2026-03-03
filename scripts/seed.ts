#!/usr/bin/env tsx

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/lib/db/pg/schema.pg";
import { eq } from "drizzle-orm";

async function seed() {
  console.log(
    "============================================================================",
  );
  console.log("🌱 HebronAI v2 - Database Seeding");
  console.log(
    "============================================================================\n",
  );

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error("❌ Error: DATABASE_URL or POSTGRES_URL not set!");
    process.exit(1);
  }

  const maskedUrl = databaseUrl.replace(/:[^:@]+@/, ":****@");
  console.log(`📍 Connecting to: ${maskedUrl}\n`);

  try {
    const sql = postgres(databaseUrl, { max: 1 });
    const db = drizzle(sql, { schema });

    console.log("✅ Connected to database\n");

    console.log("👤 Verifying admin user...");

    const existingAdmin = await db
      .select()
      .from(schema.UserTable)
      .where(eq(schema.UserTable.role, "admin"))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log(`✅ Admin user exists: ${existingAdmin[0].email}`);
    } else {
      console.log("⚠️  No admin user found. Please create one manually.");
    }

    console.log("\n📦 Verifying built-in subscription plans...");

    const builtInPlans = await db
      .select()
      .from(schema.SubscriptionPlanTable)
      .where(eq(schema.SubscriptionPlanTable.isBuiltIn, true));

    if (builtInPlans.length === 4) {
      console.log("✅ All 4 built-in plans exist:");
      builtInPlans.forEach((plan) => {
        console.log(`   - ${plan.name} (${plan.slug})`);
      });
    } else {
      console.log(
        `⚠️  Expected 4 built-in plans, found ${builtInPlans.length}`,
      );
      console.log(
        "   Run migration to create built-in plans: pnpm drizzle-kit push",
      );
    }

    await sql.end();

    console.log(
      "\n============================================================================",
    );
    console.log("✅ Verification completed successfully!");
    console.log(
      "============================================================================\n",
    );
    console.log("📊 Summary:");
    console.log(`  Admin users: ${existingAdmin.length}`);
    console.log(`  Built-in Plans: ${builtInPlans.length}/4\n`);
    console.log("💡 Note:");
    console.log("  Built-in plans are now managed by database migrations.");
    console.log(
      "  Run 'pnpm drizzle-kit push' to apply schema and seed built-in plans.",
    );

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Verification failed!");
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
