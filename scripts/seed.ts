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

    console.log("\n📦 Creating built-in subscription plans...");

    const plans = [
      {
        name: "Free",
        slug: "free",
        isBuiltIn: true,
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
          allowed: ["groq-models", "ollama-models"],
          default: "groq-llama-3.3-70b",
          limits: {
            "groq-models": {
              maxTokensPerRequest: 8000,
              maxRequestsPerDay: 100,
              maxTokensPerMonth: 50000,
            },
          },
        },
        limits: {
          chats: { maxActive: 2, maxHistory: 20 },
          messages: { maxPerChat: 50, maxPerDay: 100, maxPerMonth: 1500 },
          files: {
            maxSize: 0.5,
            maxCount: 5,
            allowedTypes: ["pdf", "txt", "md"],
          },
          api: { rateLimit: 100, burstLimit: 150 },
        },
        features: {
          mcpServers: { enabled: true, maxServers: 1, customServers: false },
          workflows: { enabled: true, maxWorkflows: 1 },
          agents: { enabled: true, maxCustomAgents: 2, shareAgents: false },
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
        metadata: {
          order: 1,
          color: "#6B7280",
          icon: "Zap",
        },
        createdBy: adminUser.id,
      },
      {
        name: "Basic",
        slug: "basic",
        isBuiltIn: true,
        displayName: { en: "Basic", ar: "مبتدئ" },
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
          allowed: [
            "gpt-5-nano",
            "gemini-2.5-flash-lite",
            "deepseek-v3",
            "groq-models",
            "ollama-models",
          ],
          default: "gpt-5-nano",
          limits: {
            "gpt-5-nano": {
              maxTokensPerRequest: 16000,
              maxRequestsPerDay: 150,
              maxTokensPerMonth: 400000,
            },
            "gemini-2.5-flash-lite": {
              maxTokensPerRequest: 32000,
              maxRequestsPerDay: 100,
              maxTokensPerMonth: 400000,
            },
          },
        },
        limits: {
          chats: { maxActive: 5, maxHistory: 50 },
          messages: { maxPerChat: 100, maxPerDay: 150, maxPerMonth: 4500 },
          files: {
            maxSize: 2,
            maxCount: 20,
            allowedTypes: ["pdf", "txt", "md", "docx"],
          },
          api: { rateLimit: 500, burstLimit: 750 },
        },
        features: {
          mcpServers: { enabled: true, maxServers: 2, customServers: false },
          workflows: { enabled: true, maxWorkflows: 3 },
          agents: { enabled: true, maxCustomAgents: 5, shareAgents: true },
          advanced: {
            codeInterpreter: true,
            imageGeneration: true,
            voiceChat: false,
            documentAnalysis: true,
            apiAccess: true,
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
          color: "#3B82F6",
          icon: "Rocket",
        },
        createdBy: adminUser.id,
      },
      {
        name: "Pro",
        slug: "pro",
        isBuiltIn: true,
        displayName: { en: "Pro", ar: "محترف" },
        description: {
          en: "For professionals and power users",
          ar: "للمحترفين والمستخدمين المتقدمين",
        },
        pricing: {
          monthly: 24.99,
          yearly: 249.9,
          currency: "USD",
          discount: { yearly: 16.67 },
        },
        models: {
          allowed: [
            "gpt-5-mini",
            "gemini-2.5-pro",
            "grok-4.1-fast",
            "claude-haiku-4.5",
            "llama-4-405b",
            "gpt-5-nano",
            "gemini-2.5-flash-lite",
            "deepseek-v3",
            "groq-models",
            "ollama-models",
          ],
          default: "gpt-5-mini",
          limits: {
            "gpt-5-mini": {
              maxTokensPerRequest: 32000,
              maxRequestsPerDay: 500,
              maxTokensPerMonth: 2500000,
            },
            "gemini-2.5-pro": {
              maxTokensPerRequest: 64000,
              maxRequestsPerDay: 400,
              maxTokensPerMonth: 2500000,
            },
            "claude-haiku-4.5": {
              maxTokensPerRequest: 48000,
              maxRequestsPerDay: 350,
              maxTokensPerMonth: 2500000,
            },
          },
        },
        limits: {
          chats: { maxActive: 20, maxHistory: 200 },
          messages: { maxPerChat: 500, maxPerDay: 2000, maxPerMonth: 60000 },
          files: {
            maxSize: 10,
            maxCount: 100,
            allowedTypes: ["*"],
          },
          api: { rateLimit: 2000, burstLimit: 3000 },
        },
        features: {
          mcpServers: { enabled: true, maxServers: 5, customServers: true },
          workflows: { enabled: true, maxWorkflows: 10 },
          agents: { enabled: true, maxCustomAgents: 20, shareAgents: true },
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
          order: 3,
          badge: "Most Popular",
          color: "#8B5CF6",
          icon: "Sparkles",
        },
        createdBy: adminUser.id,
      },
      {
        name: "Enterprise",
        slug: "enterprise",
        isBuiltIn: true,
        displayName: { en: "Enterprise", ar: "للشركات" },
        description: {
          en: "Custom solutions for teams and organizations",
          ar: "حلول مخصصة للفرق والشركات",
        },
        pricing: {
          monthly: 0,
          yearly: 0,
          currency: "USD",
          custom: true,
        },
        models: {
          allowed: ["*"],
          default: "gpt-5.2-pro",
          limits: {
            "*": {
              maxTokensPerRequest: -1,
              maxRequestsPerDay: -1,
              maxTokensPerMonth: -1,
            },
          },
        },
        limits: {
          chats: { maxActive: -1, maxHistory: -1 },
          messages: { maxPerChat: -1, maxPerDay: -1, maxPerMonth: -1 },
          files: {
            maxSize: -1,
            maxCount: -1,
            allowedTypes: ["*"],
          },
          api: { rateLimit: -1, burstLimit: -1 },
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
          allowSignup: false,
          maxUsers: null,
          trialDays: 30,
        },
        metadata: {
          order: 4,
          badge: "Custom",
          color: "#F59E0B",
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
        console.log(`🔄 Updated: ${plan.name}`);
      } else {
        await db.insert(schema.SubscriptionPlanTable).values(plan as any);
        console.log(`✅ Created: ${plan.name}`);
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
    console.log("  Admin: admin@hebronai.net");
    console.log("  Built-in Plans: 4\n");
    console.log("📊 Plans Details:");
    console.log("  1. Free ($0):");
    console.log("     - Models: 12 (Groq, Ollama)");
    console.log("     - Agents: 2 | Workflows: 1 | MCP: 1");
    console.log("     - Tokens: 50K/month | Storage: 512MB");
    console.log("     - Messages: 1,500/month | Chats: 2 active\n");
    console.log("  2. Basic ($9.99/month):");
    console.log("     - Models: 17 (GPT-5 Nano, Gemini 2.5 Flash Lite, DeepSeek v3)");
    console.log("     - Agents: 5 | Workflows: 3 | MCP: 2");
    console.log("     - Tokens: 400K/month | Storage: 2GB");
    console.log("     - Images: 3/day (90/month) | API: 500 calls/day");
    console.log("     - Messages: 4,500/month | Chats: 5 active\n");
    console.log("  3. Pro ($24.99/month):");
    console.log("     - Models: 25 (GPT-5 Mini, Gemini 2.5 Pro, Grok, Claude Haiku)");
    console.log("     - Agents: 20 | Workflows: 10 | MCP: 5");
    console.log("     - Tokens: 2.5M/month | Storage: 10GB");
    console.log("     - Images: 6/day (180/month) | API: 2,000 calls/day");
    console.log("     - Voice: 20 min/month | Messages: 60K/month\n");
    console.log("  4. Enterprise (Custom Pricing):");
    console.log("     - Models: 45+ (GPT-5.2 Pro, Claude Opus 4.5, Sora 2 Pro)");
    console.log("     - Everything unlimited");
    console.log("     - Team workspace, SSO, dedicated support");

    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Seeding failed!");
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
