#!/usr/bin/env tsx

/**
 * Database Migration Script for Vercel Postgres
 *
 * This script connects to Vercel Postgres and applies all pending migrations
 * Usage: pnpm tsx scripts/migrate.ts
 *
 * Environment variables required:
 * - DATABASE_URL or POSTGRES_URL: PostgreSQL connection string
 */

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../src/lib/db/pg/schema.pg";
import { readdir } from "fs/promises";
import { join } from "path";

async function runMigration() {
  console.log(
    "============================================================================",
  );
  console.log("🚀 HebronAI v2 - Database Migration");
  console.log(
    "============================================================================\n",
  );

  // Get database URL
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!databaseUrl) {
    console.error("❌ Error: DATABASE_URL or POSTGRES_URL not set!\n");
    console.log("Please set the environment variable:");
    console.log(
      '  export DATABASE_URL="postgresql://user:pass@host:5432/dbname"\n',
    );
    console.log("Or for Vercel Postgres:");
    console.log("  1. Go to Vercel Dashboard → Storage → Postgres");
    console.log("  2. Copy the DATABASE_URL");
    console.log('  3. Export it: export DATABASE_URL="..."');
    process.exit(1);
  }

  // Mask password in URL for display
  const maskedUrl = databaseUrl.replace(/:[^:@]+@/, ":****@");
  console.log("✅ Database URL found");
  console.log(`📍 Connecting to: ${maskedUrl}\n`);

  try {
    // Check if migrations folder exists
    const migrationsPath = join(process.cwd(), "src/lib/db/migrations/pg");
    let migrationFiles: string[] = [];

    try {
      migrationFiles = await readdir(migrationsPath);
      console.log(
        `📁 Found ${migrationFiles.length} migration files in ${migrationsPath}`,
      );
    } catch (_error) {
      console.log("📁 No migration files found - will use schema push instead");
    }

    // Create connection
    console.log("🔌 Establishing database connection...");
    const sql = postgres(databaseUrl, {
      max: 1,
      onnotice: () => {}, // Suppress notices
    });

    const db = drizzle(sql, { schema });
    console.log("✅ Connected successfully\n");

    if (migrationFiles.length > 0) {
      // Run migrations from files
      console.log("📦 Applying migrations...\n");
      await migrate(db, { migrationsFolder: migrationsPath });
      console.log("✅ All migrations applied successfully!");
    } else {
      // No migration files, inform user to use push
      console.log("ℹ️  No migration files found.");
      console.log(
        "   To sync schema directly, run: pnpm tsx scripts/db-push.ts",
      );
    }

    // Close connection
    await sql.end();

    console.log(
      "\n============================================================================",
    );
    console.log("✅ Migration completed successfully!");
    console.log(
      "============================================================================\n",
    );
    console.log("📊 Summary:");
    console.log("  - Schema: ./src/lib/db/pg/schema.pg.ts");
    console.log("  - Expected tables: 25");
    console.log("  - Migration method: Drizzle ORM");
    console.log("\n🎯 Next steps:");
    console.log("  1. Verify tables: pnpm tsx scripts/verify-db.ts");
    console.log("  2. Seed data (if needed): pnpm tsx scripts/seed.ts");
    console.log("  3. Test application");

    process.exit(0);
  } catch (error: any) {
    console.error(
      "\n============================================================================",
    );
    console.error("❌ Migration failed!");
    console.error(
      "============================================================================\n",
    );
    console.error("Error:", error.message);

    if (error.code) {
      console.error("Error code:", error.code);
    }

    if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Troubleshooting:");
      console.error("  - Check if the database server is running");
      console.error("  - Verify the connection string is correct");
      console.error("  - Check firewall settings");
    } else if (error.code === "28P01") {
      console.error("\n💡 Troubleshooting:");
      console.error("  - Check username and password");
      console.error("  - Verify database credentials");
    } else if (error.code === "3D000") {
      console.error("\n💡 Troubleshooting:");
      console.error("  - Database does not exist");
      console.error("  - Create the database first");
    }

    process.exit(1);
  }
}

runMigration();
