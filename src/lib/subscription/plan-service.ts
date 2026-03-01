import "server-only";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import { SubscriptionPlanTable, UserTable } from "@/lib/db/pg/schema.pg";
import { eq, and, sql } from "drizzle-orm";
import { cache } from "react";

// ✨ النوع الموحد للخطة
export interface UnifiedPlanLimits {
  // Models
  models: {
    allowed: string[];
    default: string;
    limits: {
      [modelName: string]: {
        maxTokensPerRequest: number;
        maxRequestsPerDay: number;
        maxTokensPerMonth: number;
      };
    };
  };

  // Chats & Messages
  chats: {
    maxActive: number;
    maxHistory: number;
  };
  messages: {
    maxPerChat: number;
    maxPerDay: number;
    maxPerMonth: number;
  };

  // Files
  files: {
    maxSize: number;
    maxCount: number;
    allowedTypes: string[];
  };

  // API
  api: {
    rateLimit: number;
    burstLimit: number;
  };

  // Features
  features: {
    mcpServers: {
      enabled: boolean;
      maxServers: number;
      customServers: boolean;
    };
    workflows: {
      enabled: boolean;
      maxWorkflows: number;
    };
    agents: {
      enabled: boolean;
      maxCustomAgents: number;
      shareAgents: boolean;
    };
    advanced: {
      codeInterpreter: boolean;
      imageGeneration: boolean;
      voiceChat: boolean;
      documentAnalysis: boolean;
      apiAccess: boolean;
      prioritySupport: boolean;
      teamWorkspace: boolean;
      exportData: boolean;
    };
  };
}

export interface UnifiedPlan {
  id: string;
  slug: string;
  name: string;
  displayName: { en: string; ar: string };
  description: { en: string; ar: string };
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
    discount?: { yearly: number };
  };
  limits: UnifiedPlanLimits;
  isBuiltIn: boolean;
  isActive: boolean;
  metadata: {
    order: number;
    badge?: string;
    color: string;
    icon: string;
  };
}

// ✨ Cache للأداء (60 ثانية)
const PLAN_CACHE_TTL = 60 * 1000;
let plansCache: { data: UnifiedPlan[]; timestamp: number } | null = null;

/**
 * ✅ الدالة الرئيسية: جلب خطة المستخدم
 * Priority: planId (dynamic) > plan (enum) > free (fallback)
 */
export async function getUserPlan(
  userId: string,
): Promise<UnifiedPlan | null> {
  try {
    const [user] = await db
      .select({
        planId: UserTable.planId,
        plan: UserTable.plan,
      })
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .limit(1);

    if (!user) return null;

    // 1️⃣ الأولوية: planId (الخطة الديناميكية)
    if (user.planId) {
      const [customPlan] = await db
        .select()
        .from(SubscriptionPlanTable)
        .where(
          and(
            eq(SubscriptionPlanTable.id, user.planId),
            sql`(admin_settings->>'isActive')::boolean = true`,
          ),
        )
        .limit(1);

      if (customPlan) {
        return mapDbPlanToUnified(customPlan);
      }
    }

    // 2️⃣ Fallback: plan enum (الخطة القديمة)
    if (user.plan) {
      const [builtInPlan] = await db
        .select()
        .from(SubscriptionPlanTable)
        .where(
          and(
            eq(SubscriptionPlanTable.slug, user.plan),
            eq(SubscriptionPlanTable.isBuiltIn, true),
          ),
        )
        .limit(1);

      if (builtInPlan) {
        return mapDbPlanToUnified(builtInPlan);
      }
    }

    // 3️⃣ الافتراضي: Free Plan
    return await getBuiltInPlan("free");
  } catch (error) {
    console.error("Error getting user plan:", error);
    return await getBuiltInPlan("free");
  }
}

/**
 * ✅ جلب خطة Built-in محددة
 */
export async function getBuiltInPlan(
  slug: string,
): Promise<UnifiedPlan | null> {
  try {
    const [plan] = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(
        and(
          eq(SubscriptionPlanTable.slug, slug),
          eq(SubscriptionPlanTable.isBuiltIn, true),
        ),
      )
      .limit(1);

    return plan ? mapDbPlanToUnified(plan) : null;
  } catch (error) {
    console.error(`Error getting built-in plan "${slug}":`, error);
    return null;
  }
}

/**
 * ✅ جلب جميع الخطط النشطة للعرض
 * Uses React cache() for automatic request deduplication
 */
export const getActivePlans = cache(async (): Promise<UnifiedPlan[]> => {
  // استخدام Cache بسيط
  if (plansCache && Date.now() - plansCache.timestamp < PLAN_CACHE_TTL) {
    return plansCache.data;
  }

  try {
    const plans = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(
        and(
          sql`(admin_settings->>'isActive')::boolean = true`,
          sql`(admin_settings->>'isVisible')::boolean = true`,
        ),
      )
      .orderBy(sql`(metadata->>'order')::int`);

    const unifiedPlans = plans.map(mapDbPlanToUnified);

    // تحديث Cache
    plansCache = {
      data: unifiedPlans,
      timestamp: Date.now(),
    };

    return unifiedPlans;
  } catch (error) {
    console.error("Error getting active plans:", error);
    return [];
  }
});

/**
 * ✅ جلب خطة محددة بـ ID
 */
export async function getPlanById(planId: string): Promise<UnifiedPlan | null> {
  try {
    const [plan] = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.id, planId))
      .limit(1);

    return plan ? mapDbPlanToUnified(plan) : null;
  } catch (error) {
    console.error(`Error getting plan by ID "${planId}":`, error);
    return null;
  }
}

/**
 * ✅ جلب خطة محددة بـ Slug
 */
export async function getPlanBySlug(
  slug: string,
): Promise<UnifiedPlan | null> {
  try {
    const [plan] = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.slug, slug))
      .limit(1);

    return plan ? mapDbPlanToUnified(plan) : null;
  } catch (error) {
    console.error(`Error getting plan by slug "${slug}":`, error);
    return null;
  }
}

/**
 * ✅ تحويل من DB Schema إلى Unified Format
 */
function mapDbPlanToUnified(dbPlan: any): UnifiedPlan {
  return {
    id: dbPlan.id,
    slug: dbPlan.slug,
    name: dbPlan.name,
    displayName: dbPlan.displayName,
    description: dbPlan.description,
    pricing: dbPlan.pricing,
    limits: {
      models: dbPlan.models,
      chats: dbPlan.limits.chats,
      messages: dbPlan.limits.messages,
      files: dbPlan.limits.files,
      api: dbPlan.limits.api,
      features: dbPlan.features,
    },
    isBuiltIn: dbPlan.isBuiltIn || false,
    isActive: dbPlan.adminSettings.isActive,
    metadata: dbPlan.metadata,
  };
}

/**
 * ✅ تحديث Cache (للاستخدام بعد تعديل الخطط)
 */
export function invalidatePlansCache() {
  plansCache = null;
}

/**
 * ✅ Helper: هل الحد unlimited؟
 */
export function isUnlimited(value: number): boolean {
  return value === -1;
}
