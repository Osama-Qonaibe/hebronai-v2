#!/usr/bin/env tsx

/**
 * Drizzle Push Script
 *
 * This script pushes the schema directly to the database without generating migration files
 * Useful for development and testing
 *
 * Usage: pnpm tsx scripts/db-push.ts
 */

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function pushSchema() {
  console.log(
    "============================================================================",
  );
  console.log("🚀 Drizzle Push - Direct Schema Sync");
  console.log(
    "============================================================================\n",
  );

  // Check for DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error(
      "❌ Error: DATABASE_URL or POSTGRES_URL environment variable is not set!",
    );
    console.log("\nPlease set one of the following:");
    console.log(
      '  export DATABASE_URL="postgresql://user:pass@host:5432/dbname"',
    );
    console.log(
      '  export POSTGRES_URL="postgresql://user:pass@host:5432/dbname"',
    );
    console.log("\nOr create a .env.local file with:");
    console.log("  DATABASE_URL=postgresql://user:pass@host:5432/dbname");
    process.exit(1);
  }

  console.log("✅ Database URL found");
  console.log(`📍 Target: ${databaseUrl.replace(/:[^:@]+@/, ":****@")}\n`);

  console.log("⚠️  WARNING: This will modify your database schema directly!");
  console.log("⚠️  Make sure you have a backup before proceeding.\n");

  try {
    console.log("📦 Running drizzle-kit push...\n");

    const { stdout, stderr } = await execAsync("pnpm drizzle-kit push", {
      env: { ...process.env, POSTGRES_URL: databaseUrl },
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);

    console.log(
      "\n============================================================================",
    );
    console.log("✅ Schema pushed successfully!");
    console.log(
      "============================================================================\n",
    );
    console.log("📊 Summary:");
    console.log("  - Schema: ./src/lib/db/pg/schema.pg.ts");
    console.log("  - Tables: 25");
    console.log("  - Method: Direct push (no migration files)");
    console.log("\n🎯 Next steps:");
    console.log("  1. Verify tables in your database");
    console.log("  2. Test the application");
    console.log("  3. Create seed data if needed");

    process.exit(0);
  } catch (error: any) {
    console.error(
      "\n============================================================================",
    );
    console.error("❌ Push failed!");
    console.error(
      "============================================================================\n",
    );
    console.error("Error:", error.message);
    if (error.stdout) console.log("\nOutput:", error.stdout);
    if (error.stderr) console.error("\nError output:", error.stderr);
    process.exit(1);
  }
}

pushSchema();
