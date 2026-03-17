import { NextResponse } from "next/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import { SubscriptionPlanTable, UserTable } from "@/lib/db/pg/schema.pg";
import { hasAdminPermission } from "@/lib/auth/permissions";
import { eq } from "drizzle-orm";

const defaultPlans = [
  {
    name: "Free",
    slug: "free",
    isBuiltIn: true,
    displayName: { en: "Free Plan", ar: "خطة مجانية" },
    description: { en: "Perfect for trying out HebronAI", ar: "مثالية لتجربة HebronAI" },
    pricing: { monthly: 0, yearly: 0, currency: "USD" },
    models: {
      allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat"],
      default: "groq-llama-3.1-8b",
      limits: {},
    },
    limits: {
      chats: { maxActive: 5, maxHistory: 20 },
      messages: { maxPerChat: 50, maxPerDay: 20, maxPerMonth: 500 },
      files: { maxSize: 5, maxCount: 3, allowedTypes: ["pdf", "txt"] },
      api: { rateLimit: 10, burstLimit: 20 },
      images: { maxPerDay: 0, maxPerMonth: 0 },
    },
    features: {
      mcpServers: { enabled: false, maxServers: 0, customServers: false },
      workflows: { enabled: false, maxWorkflows: 0 },
      agents: { enabled: false, maxCustomAgents: 0, shareAgents: false },
      advanced: {
        codeInterpreter: false, imageGeneration: false, voiceChat: false,
        documentAnalysis: false, apiAccess: false, prioritySupport: false,
        teamWorkspace: false, exportData: false,
      },
    },
    adminSettings: { isActive: true, isVisible: true, isFeatured: false, allowSignup: true, maxUsers: null, trialDays: 0 },
    metadata: { order: 1, color: "#6b7280", icon: "Zap" },
  },
  {
    name: "Basic",
    slug: "basic",
    isBuiltIn: true,
    displayName: { en: "Basic Plan", ar: "الخطة الأساسية" },
    description: { en: "For everyday users", ar: "للمستخدمين اليوميين" },
    pricing: { monthly: 9, yearly: 90, currency: "USD", discount: { yearly: 16.67 } },
    models: {
      allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat", "gpt-5-nano", "gemini-2.5-flash-lite"],
      default: "gpt-5-nano",
      limits: {},
    },
    limits: {
      chats: { maxActive: 20, maxHistory: 100 },
      messages: { maxPerChat: 200, maxPerDay: 100, maxPerMonth: 2000 },
      files: { maxSize: 10, maxCount: 10, allowedTypes: ["*"] },
      api: { rateLimit: 30, burstLimit: 50 },
      images: { maxPerDay: 5, maxPerMonth: 100 },
    },
    features: {
      mcpServers: { enabled: false, maxServers: 0, customServers: false },
      workflows: { enabled: true, maxWorkflows: 5 },
      agents: { enabled: true, maxCustomAgents: 3, shareAgents: false },
      advanced: {
        codeInterpreter: true, imageGeneration: true, voiceChat: false,
        documentAnalysis: true, apiAccess: true, prioritySupport: false,
        teamWorkspace: false, exportData: true,
      },
    },
    adminSettings: { isActive: true, isVisible: true, isFeatured: false, allowSignup: true, maxUsers: null, trialDays: 0 },
    metadata: { order: 2, color: "#3b82f6", icon: "Star" },
  },
  {
    name: "Pro",
    slug: "pro",
    isBuiltIn: true,
    displayName: { en: "Pro Plan", ar: "الخطة الاحترافية" },
    description: { en: "For power users and professionals", ar: "للمستخدمين المحترفين" },
    pricing: { monthly: 20, yearly: 200, currency: "USD", discount: { yearly: 16.67 } },
    models: {
      allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat", "gpt-5-nano", "gpt-5-mini", "gemini-2.5-pro", "claude-haiku-4.5"],
      default: "gpt-5-mini",
      limits: {},
    },
    limits: {
      chats: { maxActive: 50, maxHistory: 200 },
      messages: { maxPerChat: 500, maxPerDay: 1000, maxPerMonth: 20000 },
      files: { maxSize: 50, maxCount: 50, allowedTypes: ["*"] },
      api: { rateLimit: 60, burstLimit: 100 },
      images: { maxPerDay: 20, maxPerMonth: 500 },
    },
    features: {
      mcpServers: { enabled: true, maxServers: 10, customServers: true },
      workflows: { enabled: true, maxWorkflows: 20 },
      agents: { enabled: true, maxCustomAgents: 10, shareAgents: true },
      advanced: {
        codeInterpreter: true, imageGeneration: true, voiceChat: true,
        documentAnalysis: true, apiAccess: true, prioritySupport: true,
        teamWorkspace: false, exportData: true,
      },
    },
    adminSettings: { isActive: true, isVisible: true, isFeatured: true, allowSignup: true, maxUsers: null, trialDays: 7 },
    metadata: { order: 3, badge: "Most Popular", color: "#8b5cf6", icon: "Sparkles" },
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    isBuiltIn: true,
    displayName: { en: "Enterprise Plan", ar: "خطة المؤسسات" },
    description: { en: "For teams and organizations", ar: "للفرق والمؤسسات" },
    pricing: { monthly: 99, yearly: 999, currency: "USD", discount: { yearly: 16.5 } },
    models: { allowed: ["*"], default: "gpt-5-pro", limits: {} },
    limits: {
      chats: { maxActive: -1, maxHistory: -1 },
      messages: { maxPerChat: -1, maxPerDay: -1, maxPerMonth: -1 },
      files: { maxSize: 100, maxCount: -1, allowedTypes: ["*"] },
      api: { rateLimit: 120, burstLimit: 200 },
      images: { maxPerDay: -1, maxPerMonth: -1 },
    },
    features: {
      mcpServers: { enabled: true, maxServers: -1, customServers: true },
      workflows: { enabled: true, maxWorkflows: -1 },
      agents: { enabled: true, maxCustomAgents: -1, shareAgents: true },
      advanced: {
        codeInterpreter: true, imageGeneration: true, voiceChat: true,
        documentAnalysis: true, apiAccess: true, prioritySupport: true,
        teamWorkspace: true, exportData: true,
      },
    },
    adminSettings: { isActive: true, isVisible: true, isFeatured: false, allowSignup: true, maxUsers: null, trialDays: 14 },
    metadata: { order: 4, badge: "Best Value", color: "#f59e0b", icon: "Crown" },
  },
];

type SeedResult = { plan: string; status: string; reason?: string };

async function seedPlans() {
  const hasPermission = await hasAdminPermission();
  if (!hasPermission) return null;

  const adminUsers = await pgDb.select().from(UserTable).where(eq(UserTable.role, "admin")).limit(1);
  const systemAdminId = adminUsers.length > 0 ? adminUsers[0].id : "00000000-0000-0000-0000-000000000000";

  const results: SeedResult[] = [];

  for (const plan of defaultPlans) {
    const existing = await pgDb.select().from(SubscriptionPlanTable).where(eq(SubscriptionPlanTable.slug, plan.slug)).limit(1);

    if (existing.length > 0) {
      await pgDb.update(SubscriptionPlanTable).set({ ...plan, isBuiltIn: true, updatedAt: new Date() } as any).where(eq(SubscriptionPlanTable.slug, plan.slug));
      results.push({ plan: plan.name, status: "updated", reason: "existing plan updated" });
    } else {
      await pgDb.insert(SubscriptionPlanTable).values({ ...plan, createdBy: systemAdminId } as any);
      results.push({ plan: plan.name, status: "created" });
    }
  }

  return results;
}

export async function GET() {
  try {
    const results = await seedPlans();
    if (!results) return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error seeding plans:", error);
    return NextResponse.json({ error: "Failed to seed plans" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const results = await seedPlans();
    if (!results) return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error seeding plans:", error);
    return NextResponse.json({ error: "Failed to seed plans" }, { status: 500 });
  }
}
