#!/usr/bin/env tsx
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import postgres from "postgres";
import { consola } from "consola";
import { seedPlansIfNeeded } from "@/lib/db/seeds/plans.seed";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  
  try {
    consola.info("🚀 Running migrations...");
    
    await migrate(db, {
      migrationsFolder: "./src/lib/db/migrations/pg",
    });
    
    consola.success("✅ Migrations completed!");
    
    // Auto-seed plans if they don't exist
    consola.info("🌱 Checking if plans need seeding...");
    await seedPlansIfNeeded();
    
    await client.end();
    process.exit(0);
  } catch (error) {
    consola.error("❌ Migration failed:", error);
    await client.end();
    process.exit(1);
  }
}

main();
