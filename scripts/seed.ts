#!/usr/bin/env tsx

/**
 * Database Seed Script
 *
 * This script seeds the database with initial data:
 * - Admin user
 * - Subscription plans
 *
 * Usage: pnpm tsx scripts/seed.ts
 */

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

    // 1. Create Admin User
    console.log("👤 Creating admin user...");

    const existingAdmin = await db
      .select()
      .from(schema.UserTable)
      .where(eq(schema.UserTable.email, "admin@hebronai.net"))
      .limit(1);

    let adminUser;
    if (existingAdmin.length > 0) {
      console.log("ℹ️  Admin user already exists");
      adminUser = existingAdmin[0];
    } else {
      const [newAdmin] = await db
        .insert(schema.UserTable)
        .values({
          name: "Admin",
          email: "admin@hebronai.net",
          emailVerified: true,
          role: "admin",
          plan: "enterprise",
          planStatus: "active",
          planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        })
        .returning();

      console.log("✅ Admin user created");
      console.log(`   Email: admin@hebronai.net`);
      console.log(`   ID: ${newAdmin.id}`);
      adminUser = newAdmin;
    }

    // 2. Create Subscription Plans
    console.log("\n📦 Creating subscription plans...");

    const plans = [
      {
        name: "Free Plan",
        slug: "free",
        displayName: { en: "Free", ar: "مجاني" },
        description: {
          en: "Perfect for trying out HebronAI",
          ar: "مثالي لتجربة HebronAI",
        },
        pricing: {
          monthly: 0,
          yearly: 0,
          currency: "USD",
        },
        models: {
          allowed: ["gpt-4.1-nano", "gemini-2.5-flash"],
          default: "gpt-4.1-nano",
          limits: {
            "gpt-4.1-nano": {
              maxTokensPerRequest: 4000,
              maxRequestsPerDay: 50,
              maxTokensPerMonth: 100000,
            },
          },
        },
        limits: {
          chats: { maxActive: 5, maxHistory: 10 },
          messages: { maxPerChat: 50, maxPerDay: 100, maxPerMonth: 1000 },
          files: {
            maxSize: 5,
            maxCount: 10,
            allowedTypes: ["pdf", "txt", "md"],
          },
          api: { rateLimit: 10, burstLimit: 20 },
        },
        features: {
          mcpServers: { enabled: false, maxServers: 0, customServers: false },
          workflows: { enabled: false, maxWorkflows: 0 },
          agents: { enabled: false, maxCustomAgents: 0, shareAgents: false },
          advanced: {
            codeInterpreter: false,
            imageGeneration: false,
            voiceChat: false,
            documentAnalysis: false,
            apiAccess: false,
            prioritySupport: false,
            teamWorkspace: false,
            exportData: false,
          },
        },
        adminSettings: {
          isActive: true,
          isVisible: true,
          isFeatured: false,
          allowSignup: true,
          maxUsers: null,
          trialDays: 30,
        },
        metadata: {
          order: 1,
          color: "#gray",
          icon: "🆓",
        },
        createdBy: adminUser.id,
      },
      {
        name: "Pro Plan",
        slug: "pro",
        displayName: { en: "Pro", ar: "احترافي" },
        description: {
          en: "For professionals and power users",
          ar: "للمحترفين والمستخدمين المتقدمين",
        },
        pricing: {
          monthly: 29,
          yearly: 290,
          currency: "USD",
          discount: { yearly: 20 },
        },
        models: {
          allowed: ["gpt-4.1-mini", "gpt-4.1-nano", "gemini-2.5-flash"],
          default: "gpt-4.1-mini",
          limits: {
            "gpt-4.1-mini": {
              maxTokensPerRequest: 16000,
              maxRequestsPerDay: 500,
              maxTokensPerMonth: 2000000,
            },
          },
        },
        limits: {
          chats: { maxActive: 50, maxHistory: 100 },
          messages: { maxPerChat: 500, maxPerDay: 1000, maxPerMonth: 20000 },
          files: {
            maxSize: 50,
            maxCount: 100,
            allowedTypes: ["pdf", "txt", "md", "docx", "xlsx"],
          },
          api: { rateLimit: 100, burstLimit: 200 },
        },
        features: {
          mcpServers: { enabled: true, maxServers: 5, customServers: true },
          workflows: { enabled: true, maxWorkflows: 10 },
          agents: { enabled: true, maxCustomAgents: 5, shareAgents: true },
          advanced: {
            codeInterpreter: true,
            imageGeneration: true,
            voiceChat: true,
            documentAnalysis: true,
            apiAccess: true,
            prioritySupport: true,
            teamWorkspace: false,
            exportData: true,
          },
        },
        adminSettings: {
          isActive: true,
          isVisible: true,
          isFeatured: true,
          allowSignup: true,
          maxUsers: null,
          trialDays: 14,
        },
        metadata: {
          order: 2,
          badge: "Popular",
          color: "#blue",
          icon: "⭐",
        },
        createdBy: adminUser.id,
      },
    ];

    for (const plan of plans) {
      const existing = await db
        .select()
        .from(schema.SubscriptionPlanTable)
        .where(eq(schema.SubscriptionPlanTable.slug, plan.slug))
        .limit(1);

      if (existing.length > 0) {
        console.log(`ℹ️  Plan "${plan.name}" already exists`);
      } else {
        await db.insert(schema.SubscriptionPlanTable).values(plan);
        console.log(`✅ Created plan: ${plan.name}`);
      }
    }

    await sql.end();

    console.log(
      "\n============================================================================",
    );
    console.log("✅ Seeding completed successfully!");
    console.log(
      "============================================================================\n",
    );
    console.log("📊 Summary:");
    console.log("  - Admin user: admin@hebronai.net");
    console.log("  - Subscription plans: 2 (Free, Pro)");
    console.log("\n🎯 Next steps:");
    console.log("  1. Set admin password (if using email/password auth)");
    console.log("  2. Test login with admin account");
    console.log("  3. Configure additional settings in admin panel");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Seeding failed!");
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
