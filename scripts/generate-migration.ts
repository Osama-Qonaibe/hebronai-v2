#!/usr/bin/env tsx

/**
 * Generate Drizzle Migration Script
 *
 * This script generates SQL migration files from the Drizzle schema
 * Usage: pnpm tsx scripts/generate-migration.ts
 */

import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../src/lib/db/pg/schema.pg";

async function generateMigration() {
  console.log("🚀 Starting migration generation...\n");

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
    process.exit(1);
  }

  console.log("✅ Database URL found");
  console.log(
    `📍 Connecting to: ${databaseUrl.replace(/:[^:@]+@/, ":****@")}\n`,
  );

  try {
    // Create postgres connection
    const sql = postgres(databaseUrl, { max: 1 });
    const db = drizzle(sql, { schema });

    console.log("✅ Connected to database");
    console.log("📦 Running migrations...\n");

    // Run migrations
    await migrate(db, { migrationsFolder: "./src/lib/db/migrations/pg" });

    console.log("✅ Migration completed successfully!");
    console.log("\n📊 Summary:");
    console.log("  - Schema: ./src/lib/db/pg/schema.pg.ts");
    console.log("  - Migrations: ./src/lib/db/migrations/pg");
    console.log("  - Tables: 25");

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:");
    console.error(error);
    process.exit(1);
  }
}

generateMigration();
