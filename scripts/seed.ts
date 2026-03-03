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
          planExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        })
        .returning();

      console.log("✅ Admin user created");
      console.log(`   Email: admin@hebronai.net`);
      console.log(`   ID: ${newAdmin.id}`);
      adminUser = newAdmin;
    }

    console.log("\n📦 Creating subscription plans...");

    const plans = [
      {
        name: "Free",
        slug: "free",
        isBuiltIn: true,
        displayName: { en: "Free Plan", ar: "خطة مجانية" },
        description: {
          en: "Perfect for trying out HebronAI",
          ar: "مثالية لتجربة HebronAI",
        },
        pricing: {
          monthly: 0,
          yearly: 0,
          currency: "USD",
        },
        models: {
          allowed: ["gpt-3.5-turbo"],
          default: "gpt-3.5-turbo",
          limits: {
            "gpt-3.5-turbo": {
              maxTokensPerRequest: 4096,
              maxRequestsPerDay: 50,
              maxTokensPerMonth: 100000,
            },
          },
        },
        limits: {
          chats: { maxActive: 5, maxHistory: 20 },
          messages: { maxPerChat: 50, maxPerDay: 100, maxPerMonth: 1000 },
          files: { maxSize: 5, maxCount: 5, allowedTypes: ["pdf", "txt", "docx"] },
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
          trialDays: 0,
        },
        metadata: { order: 1, color: "#3b82f6", icon: "Zap" },
        createdBy: adminUser.id,
      },
      {
        name: "Basic",
        slug: "basic",
        isBuiltIn: true,
        displayName: { en: "Basic Plan", ar: "خطة أساسية" },
        description: {
          en: "For individuals and small projects",
          ar: "للأفراد والمشاريع الصغيرة",
        },
        pricing: {
          monthly: 9.99,
          yearly: 99.9,
          currency: "USD",
          discount: { yearly: 16.75 },
        },
        models: {
          allowed: ["gpt-4", "claude-3-haiku", "gemini-flash"],
          default: "gpt-4",
          limits: {
            "gpt-4": {
              maxTokensPerRequest: 64000,
              maxRequestsPerDay: 200,
              maxTokensPerMonth: 400000,
            },
            "claude-3-haiku": {
              maxTokensPerRequest: 100000,
              maxRequestsPerDay: 150,
              maxTokensPerMonth: 400000,
            },
          },
        },
        limits: {
          chats: { maxActive: 20, maxHistory: 100 },
          messages: { maxPerChat: 200, maxPerDay: 500, maxPerMonth: 10000 },
          files: { maxSize: 20, maxCount: 20, allowedTypes: ["pdf", "txt", "docx", "md"] },
          api: { rateLimit: 30, burstLimit: 50 },
        },
        features: {
          mcpServers: { enabled: true, maxServers: 5, customServers: false },
          workflows: { enabled: true, maxWorkflows: 10 },
          agents: { enabled: true, maxCustomAgents: 5, shareAgents: false },
          advanced: {
            codeInterpreter: true,
            imageGeneration: false,
            voiceChat: false,
            documentAnalysis: true,
            apiAccess: false,
            prioritySupport: false,
            teamWorkspace: false,
            exportData: true,
          },
        },
        adminSettings: {
          isActive: true,
          isVisible: true,
          isFeatured: false,
          allowSignup: true,
          maxUsers: null,
          trialDays: 7,
        },
        metadata: {
          order: 2,
          color: "#10b981",
          icon: "Rocket",
        },
        createdBy: adminUser.id,
      },
      {
        name: "Pro",
        slug: "pro",
        isBuiltIn: true,
        displayName: { en: "Pro Plan", ar: "خطة احترافية" },
        description: {
          en: "For power users and professionals",
          ar: "للمستخدمين المحترفين",
        },
        pricing: {
          monthly: 20,
          yearly: 200,
          currency: "USD",
          discount: { yearly: 16.67 },
        },
        models: {
          allowed: ["gpt-4", "claude-3-opus", "gemini-pro"],
          default: "gpt-4",
          limits: {
            "gpt-4": {
              maxTokensPerRequest: 128000,
              maxRequestsPerDay: 500,
              maxTokensPerMonth: 1000000,
            },
            "claude-3-opus": {
              maxTokensPerRequest: 200000,
              maxRequestsPerDay: 400,
              maxTokensPerMonth: 800000,
            },
            "gemini-pro": {
              maxTokensPerRequest: 100000,
              maxRequestsPerDay: 300,
              maxTokensPerMonth: 500000,
            },
          },
        },
        limits: {
          chats: { maxActive: 50, maxHistory: 200 },
          messages: { maxPerChat: 500, maxPerDay: 1000, maxPerMonth: 20000 },
          files: { maxSize: 50, maxCount: 50, allowedTypes: ["*"] },
          api: { rateLimit: 60, burstLimit: 100 },
        },
        features: {
          mcpServers: { enabled: true, maxServers: 10, customServers: true },
          workflows: { enabled: true, maxWorkflows: 20 },
          agents: { enabled: true, maxCustomAgents: 10, shareAgents: true },
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
          trialDays: 7,
        },
        metadata: {
          order: 3,
          badge: "Most Popular",
          color: "#8b5cf6",
          icon: "Sparkles",
        },
        createdBy: adminUser.id,
      },
      {
        name: "Enterprise",
        slug: "enterprise",
        isBuiltIn: true,
        displayName: { en: "Enterprise Plan", ar: "خطة المؤسسات" },
        description: {
          en: "For teams and organizations",
          ar: "للفرق والمؤسسات",
        },
        pricing: {
          monthly: 99,
          yearly: 999,
          currency: "USD",
          discount: { yearly: 16.5 },
        },
        models: {
          allowed: ["gpt-4", "claude-3-opus", "gemini-pro", "gpt-4-turbo"],
          default: "gpt-4-turbo",
          limits: {
            "gpt-4": {
              maxTokensPerRequest: 128000,
              maxRequestsPerDay: -1,
              maxTokensPerMonth: -1,
            },
            "claude-3-opus": {
              maxTokensPerRequest: 200000,
              maxRequestsPerDay: -1,
              maxTokensPerMonth: -1,
            },
            "gemini-pro": {
              maxTokensPerRequest: 100000,
              maxRequestsPerDay: -1,
              maxTokensPerMonth: -1,
            },
            "gpt-4-turbo": {
              maxTokensPerRequest: 128000,
              maxRequestsPerDay: -1,
              maxTokensPerMonth: -1,
            },
          },
        },
        limits: {
          chats: { maxActive: -1, maxHistory: -1 },
          messages: { maxPerChat: -1, maxPerDay: -1, maxPerMonth: -1 },
          files: { maxSize: 100, maxCount: -1, allowedTypes: ["*"] },
          api: { rateLimit: 120, burstLimit: 200 },
        },
        features: {
          mcpServers: { enabled: true, maxServers: -1, customServers: true },
          workflows: { enabled: true, maxWorkflows: -1 },
          agents: { enabled: true, maxCustomAgents: -1, shareAgents: true },
          advanced: {
            codeInterpreter: true,
            imageGeneration: true,
            voiceChat: true,
            documentAnalysis: true,
            apiAccess: true,
            prioritySupport: true,
            teamWorkspace: true,
            exportData: true,
          },
        },
        adminSettings: {
          isActive: true,
          isVisible: true,
          isFeatured: false,
          allowSignup: true,
          maxUsers: null,
          trialDays: 14,
        },
        metadata: {
          order: 4,
          badge: "Best Value",
          color: "#f59e0b",
          icon: "Crown",
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
        await db
          .update(schema.SubscriptionPlanTable)
          .set({
            ...plan,
            updatedAt: new Date(),
          } as any)
          .where(eq(schema.SubscriptionPlanTable.slug, plan.slug));
        console.log(`🔄 Updated plan: ${plan.name}`);
      } else {
        await db.insert(schema.SubscriptionPlanTable).values(plan as any);
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
    console.log("  - Subscription plans: 4 (Free, Basic, Pro, Enterprise)");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Seeding failed!");
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
