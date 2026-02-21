#!/usr/bin/env tsx

/**
 * Database Verification Script
 *
 * This script verifies that all tables, indexes, and constraints are properly created
 * Usage: pnpm tsx scripts/verify-db.ts
 */

import postgres from "postgres";

const EXPECTED_TABLES = [
  "subscription_plan",
  "user",
  "payment_gateway",
  "subscription_request",
  "session",
  "account",
  "verification",
  "chat_thread",
  "chat_message",
  "agent",
  "mcp_server",
  "mcp_server_tool_custom_instructions",
  "mcp_server_custom_instructions",
  "mcp_oauth_session",
  "workflow",
  "workflow_node",
  "workflow_edge",
  "bookmark",
  "archive",
  "archive_item",
  "chat_export",
  "chat_export_comment",
  "usage",
  "image_generation",
  "daily_usage_summary",
];

async function verifyDatabase() {
  console.log(
    "============================================================================",
  );
  console.log("🔍 HebronAI v2 - Database Verification");
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

    // 1. Check tables
    console.log("📊 Checking tables...\n");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;

    const tableNames = tables.map((t: any) => t.table_name);
    const missingTables = EXPECTED_TABLES.filter(
      (t) => !tableNames.includes(t),
    );
    const extraTables = tableNames.filter(
      (t: string) => !EXPECTED_TABLES.includes(t),
    );

    console.log(
      `✅ Found ${tableNames.length} tables (expected: ${EXPECTED_TABLES.length})`,
    );

    if (missingTables.length > 0) {
      console.log(`\n⚠️  Missing tables (${missingTables.length}):`);
      missingTables.forEach((t) => console.log(`   - ${t}`));
    }

    if (extraTables.length > 0) {
      console.log(`\nℹ️  Extra tables (${extraTables.length}):`);
      extraTables.forEach((t) => console.log(`   - ${t}`));
    }

    if (missingTables.length === 0) {
      console.log("✅ All expected tables exist!\n");
    }

    // 2. Check indexes
    console.log("📑 Checking indexes...\n");
    const indexes = await sql`
      SELECT 
        schemaname,
        tablename,
        indexname
      FROM pg_indexes 
      WHERE schemaname = 'public'
      ORDER BY tablename, indexname
    `;

    console.log(`✅ Found ${indexes.length} indexes\n`);

    // Group indexes by table
    const indexesByTable: Record<string, string[]> = {};
    indexes.forEach((idx: any) => {
      if (!indexesByTable[idx.tablename]) {
        indexesByTable[idx.tablename] = [];
      }
      indexesByTable[idx.tablename].push(idx.indexname);
    });

    // Display indexes per table
    console.log("Indexes by table:");
    Object.entries(indexesByTable).forEach(([table, idxs]) => {
      console.log(`  ${table}: ${idxs.length} indexes`);
    });

    // 3. Check foreign keys
    console.log("\n🔗 Checking foreign keys...\n");
    const foreignKeys = await sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name
    `;

    console.log(`✅ Found ${foreignKeys.length} foreign key constraints\n`);

    // Group by table
    const fksByTable: Record<string, number> = {};
    foreignKeys.forEach((fk: any) => {
      fksByTable[fk.table_name] = (fksByTable[fk.table_name] || 0) + 1;
    });

    console.log("Foreign keys by table:");
    Object.entries(fksByTable).forEach(([table, count]) => {
      console.log(`  ${table}: ${count} foreign keys`);
    });

    // 4. Check triggers
    console.log("\n⚡ Checking triggers...\n");
    const triggers = await sql`
      SELECT 
        trigger_name,
        event_object_table AS table_name,
        action_timing,
        event_manipulation
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table, trigger_name
    `;

    console.log(`✅ Found ${triggers.length} triggers\n`);

    if (triggers.length > 0) {
      console.log("Triggers by table:");
      const triggersByTable: Record<string, number> = {};
      triggers.forEach((trg: any) => {
        triggersByTable[trg.table_name] =
          (triggersByTable[trg.table_name] || 0) + 1;
      });
      Object.entries(triggersByTable).forEach(([table, count]) => {
        console.log(`  ${table}: ${count} triggers`);
      });
    }

    // 5. Check row counts
    console.log("\n📈 Checking row counts...\n");
    for (const table of EXPECTED_TABLES.slice(0, 5)) {
      // Check first 5 tables
      try {
        const result = await sql`
          SELECT COUNT(*) as count 
          FROM ${sql(table)}
        `;
        console.log(`  ${table}: ${result[0].count} rows`);
      } catch (_error) {
        console.log(`  ${table}: ❌ Error counting rows`);
      }
    }

    await sql.end();

    // Final summary
    console.log(
      "\n============================================================================",
    );
    console.log("✅ Verification completed!");
    console.log(
      "============================================================================\n",
    );
    console.log("📊 Summary:");
    console.log(`  - Tables: ${tableNames.length}/${EXPECTED_TABLES.length}`);
    console.log(`  - Indexes: ${indexes.length}`);
    console.log(`  - Foreign Keys: ${foreignKeys.length}`);
    console.log(`  - Triggers: ${triggers.length}`);

    if (missingTables.length === 0) {
      console.log("\n✅ Database schema is complete and ready!");
      process.exit(0);
    } else {
      console.log(
        `\n⚠️  ${missingTables.length} tables are missing. Run migration again.`,
      );
      process.exit(1);
    }
  } catch (error: any) {
    console.error("\n❌ Verification failed!");
    console.error("Error:", error.message);
    process.exit(1);
  }
}

verifyDatabase();
