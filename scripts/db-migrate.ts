#!/usr/bin/env tsx
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { pgDb } from "@/lib/db/pg/db.pg";
import { consola } from "consola";
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
    consola.info("ℹ️  Note: Seed plans manually using 'pnpm db:seed:plans' if needed");
    
    process.exit(0);
  } catch (error) {
    consola.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
