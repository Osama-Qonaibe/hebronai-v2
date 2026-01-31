#!/usr/bin/env tsx
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pgDb } from "@/lib/db/pg/db.pg";
import { consola } from "consola";
import { seedPlansIfNeeded } from "@/lib/db/seeds/plans.seed";
import { join } from "path";

async function main() {
  try {
    consola.info("🚀 Running migrations...");
    
    const start = Date.now();
    await migrate(pgDb, {
      migrationsFolder: join(process.cwd(), "src/lib/db/migrations/pg"),
    });
    const end = Date.now();
    
    consola.success(`✅ Migrations completed in ${end - start}ms`);
    
    // Auto-seed plans if they don't exist
    consola.info("🌱 Checking if plans need seeding...");
    await seedPlansIfNeeded();
    
    consola.success("🎉 All done!");
    process.exit(0);
  } catch (error) {
    consola.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
