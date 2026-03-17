import { NextRequest, NextResponse } from "next/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import { SubscriptionPlanTable, SubscriptionPlanEntity } from "@/lib/db/pg/schema.pg";
import { hasAdminPermission } from "@/lib/auth/permissions";
import { auth } from "@/lib/auth/server";
import { desc, sql } from "drizzle-orm";
import { PLAN_LIMITS, PLANS, type SubscriptionPlan } from "@/lib/subscription/plans";

const BUILT_IN_SLUGS: SubscriptionPlan[] = ["free", "basic", "pro", "enterprise"];

const MODEL_CONFIGS: Record<SubscriptionPlan, { allowed: string[]; default: string }> = {
  free: { allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat"], default: "groq-llama-3.1-8b" },
  basic: { allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat", "gpt-5-nano", "gemini-2.5-flash-lite"], default: "gpt-5-nano" },
  pro: { allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat", "gpt-5-nano", "gpt-5-mini", "gemini-2.5-pro", "grok-4-1-fast", "claude-haiku-4.5"], default: "gpt-5-mini" },
  enterprise: { allowed: ["*"], default: "gpt-5.2-pro" },
};

function buildBuiltInPlan(slug: SubscriptionPlan) {
  const p = PLANS[slug];
  const l = PLAN_LIMITS[slug];
  const m = MODEL_CONFIGS[slug];
  return {
    id: slug,
    slug,
    name: slug,
    displayName: { en: p.displayName, ar: p.displayName },
    description: { en: p.displayName, ar: p.displayName },
    pricing: { monthly: p.price, yearly: p.price * 10, currency: "USD", discount: { yearly: 20 } },
    paymentType: slug === "free" ? "free" : "manual",
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    durationValue: 1,
    durationUnit: "months",
    models: { allowed: m.allowed, default: m.default, limits: {} },
    limits: {
      chats: { maxActive: 100, maxHistory: 1000 },
      messages: { maxPerChat: 1000, maxPerDay: l.maxTokensPerMonth > 0 ? 1000 : 20, maxPerMonth: 30000 },
      files: { maxSize: 10485760, maxCount: 10, allowedTypes: ["*"] },
      images: { maxPerDay: l.maxImagesPerDay, maxPerMonth: l.maxImagesPerDay * 30 },
      storage: { maxGB: 1 },
      api: { rateLimit: l.maxAPICallsPerDay, burstLimit: 100 },
      agents: { maxCustomAgents: l.maxAgents },
      workflows: { maxWorkflows: l.maxWorkflows },
      mcpServers: { maxServers: l.maxMCPServers },
      tokens: { maxPerMonth: l.maxTokensPerMonth },
      documents: { maxPerMonth: l.maxDocumentsPerMonth },
      voice: { maxMinutesPerMonth: l.maxVoiceMinutesPerMonth },
    },
    features: {
      mcpServers: { enabled: l.maxMCPServers > 0, maxServers: l.maxMCPServers, customServers: slug !== "free" },
      workflows: { enabled: l.maxWorkflows > 0, maxWorkflows: l.maxWorkflows },
      agents: { enabled: l.maxAgents > 0, maxCustomAgents: l.maxAgents, shareAgents: slug !== "free" },
      advanced: {
        codeInterpreter: true,
        imageGeneration: l.maxImagesPerDay > 0,
        voiceChat: l.maxVoiceMinutesPerMonth > 0,
        documentAnalysis: l.maxDocumentsPerMonth > 0,
        apiAccess: slug !== "free",
        prioritySupport: slug === "pro" || slug === "enterprise",
        teamWorkspace: slug === "enterprise",
        exportData: slug !== "free",
      },
    },
    adminSettings: { isActive: true, isVisible: true, isFeatured: slug === "pro", allowSignup: true, maxUsers: null, trialDays: 0 },
    metadata: {
      order: slug === "free" ? 1 : slug === "basic" ? 2 : slug === "pro" ? 3 : 4,
      badge: slug === "pro" ? "Popular" : undefined,
      color: slug === "free" ? "gray" : slug === "basic" ? "blue" : slug === "pro" ? "purple" : "gold",
      icon: "star",
    },
    isBuiltIn: true,
    tags: [],
    createdBy: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const includeInactive = request.nextUrl.searchParams.get("includeInactive") === "true";

    let query = pgDb.select().from(SubscriptionPlanTable);
    if (!includeInactive) {
      query = query.where(sql`(admin_settings->>'isActive')::boolean = true`) as any;
    }

    const dbPlans = await query.orderBy(desc(SubscriptionPlanTable.createdAt));
    const builtInPlans = BUILT_IN_SLUGS.map(buildBuiltInPlan);

    return NextResponse.json({ plans: [...builtInPlans, ...dbPlans] });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();

    const result = await pgDb
      .insert(SubscriptionPlanTable)
      .values({ ...body, createdBy: session.user.id })
      .returning();

    const newPlan: SubscriptionPlanEntity = result[0];
    return NextResponse.json({ plan: newPlan }, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}
