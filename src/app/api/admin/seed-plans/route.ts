import { NextResponse } from "next/server";
import { db } from "@/lib/db/pg/db.pg";
import { SubscriptionPlanTable, UserTable } from "@/lib/db/pg/schema.pg";
import { hasAdminPermission } from "@/lib/auth/permissions";
import { eq } from "drizzle-orm";

const defaultPlans = [
  {
    name: "Free",
    slug: "free",
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
  },
  {
    name: "Pro",
    slug: "pro",
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
      order: 2,
      badge: "Most Popular",
      color: "#8b5cf6",
      icon: "Sparkles",
    },
  },
  {
    name: "Enterprise",
    slug: "enterprise",
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
      order: 3,
      badge: "Best Value",
      color: "#f59e0b",
      icon: "Crown",
    },
  },
];

export async function POST() {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const adminUsers = await db
      .select()
      .from(UserTable)
      .where(eq(UserTable.role, "admin"))
      .limit(1);

    const systemAdminId =
      adminUsers.length > 0
        ? adminUsers[0].id
        : "00000000-0000-0000-0000-000000000000";

    const results = [];

    for (const plan of defaultPlans) {
      const existing = await db
        .select()
        .from(SubscriptionPlanTable)
        .where(eq(SubscriptionPlanTable.slug, plan.slug))
        .limit(1);

      if (existing.length > 0) {
        results.push({ plan: plan.name, status: "skipped", reason: "exists" });
        continue;
      }

      await db.insert(SubscriptionPlanTable).values({
        ...plan,
        createdBy: systemAdminId,
      });
      results.push({ plan: plan.name, status: "created" });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Error seeding plans:", error);
    return NextResponse.json(
      { error: "Failed to seed plans" },
      { status: 500 },
    );
  }
}
