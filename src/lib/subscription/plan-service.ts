import "server-only";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import { UserTable, SubscriptionPlanTable } from "@/lib/db/pg/schema.pg";
import { eq } from "drizzle-orm";
import { PLAN_LIMITS, PLANS, type SubscriptionPlan } from "./plans";

export interface UnifiedPlanLimits {
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
  chats: {
    maxActive: number;
    maxHistory: number;
  };
  messages: {
    maxPerChat: number;
    maxPerDay: number;
    maxPerMonth: number;
  };
  files: {
    maxSize: number;
    maxCount: number;
    allowedTypes: string[];
  };
  api: {
    rateLimit: number;
    burstLimit: number;
  };
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
  paymentType: "stripe" | "manual" | "free";
  stripePriceIdMonthly?: string | null;
  stripePriceIdYearly?: string | null;
  metadata: {
    order: number;
    badge?: string;
    color: string;
    icon: string;
  };
}

const MODEL_CONFIGS: Record<SubscriptionPlan, { allowed: string[]; default: string }> = {
  free: {
    allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat"],
    default: "groq-llama-3.1-8b"
  },
  basic: {
    allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat", "gpt-5-nano", "gemini-2.5-flash-lite"],
    default: "gpt-5-nano"
  },
  pro: {
    allowed: ["groq-llama-3.1-8b", "groq-llama-3.1-70b", "deepseek-chat", "gpt-5-nano", "gpt-5-mini", "gemini-2.5-pro", "grok-4-1-fast", "claude-haiku-4.5"],
    default: "gpt-5-mini"
  },
  enterprise: {
    allowed: ["*"],
    default: "gpt-5.2-pro"
  }
};

function mapHardcodedPlanToUnified(planSlug: SubscriptionPlan, isActive: boolean): UnifiedPlan {
  const planDetails = PLANS[planSlug];
  const planLimits = PLAN_LIMITS[planSlug];
  const modelConfig = MODEL_CONFIGS[planSlug];

  return {
    id: planSlug,
    slug: planSlug,
    name: planDetails.displayName,
    displayName: { en: planDetails.displayName, ar: planDetails.displayName },
    description: { en: planDetails.displayName, ar: planDetails.displayName },
    pricing: {
      monthly: planDetails.price,
      yearly: planDetails.price * 10,
      currency: "USD",
      discount: { yearly: 20 }
    },
    paymentType: planSlug === "free" ? "free" : "manual",
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    limits: {
      models: {
        allowed: modelConfig.allowed,
        default: modelConfig.default,
        limits: {}
      },
      chats: { maxActive: 100, maxHistory: 1000 },
      messages: { maxPerChat: 1000, maxPerDay: planLimits.maxTokensPerMonth > 0 ? 1000 : 20, maxPerMonth: 30000 },
      files: { maxSize: 10, maxCount: 100, allowedTypes: ["*"] },
      api: { rateLimit: planLimits.maxAPICallsPerDay, burstLimit: 100 },
      features: {
        mcpServers: {
          enabled: planLimits.maxMCPServers > 0,
          maxServers: planLimits.maxMCPServers,
          customServers: planSlug !== "free"
        },
        workflows: {
          enabled: planLimits.maxWorkflows > 0,
          maxWorkflows: planLimits.maxWorkflows
        },
        agents: {
          enabled: planLimits.maxAgents > 0,
          maxCustomAgents: planLimits.maxAgents,
          shareAgents: planSlug !== "free"
        },
        advanced: {
          codeInterpreter: true,
          imageGeneration: planLimits.maxImagesPerDay > 0,
          voiceChat: planLimits.maxVoiceMinutesPerMonth > 0,
          documentAnalysis: planLimits.maxDocumentsPerMonth > 0,
          apiAccess: planSlug !== "free",
          prioritySupport: planSlug === "pro" || planSlug === "enterprise",
          teamWorkspace: planSlug === "enterprise",
          exportData: planSlug !== "free"
        }
      }
    },
    isBuiltIn: true,
    isActive,
    metadata: {
      order: planSlug === "free" ? 1 : planSlug === "basic" ? 2 : planSlug === "pro" ? 3 : 4,
      badge: planSlug === "pro" ? "Popular" : undefined,
      color: planSlug === "free" ? "gray" : planSlug === "basic" ? "blue" : planSlug === "pro" ? "purple" : "gold",
      icon: "star"
    }
  };
}

function mapDbPlanToUnified(dbPlan: any, isActive: boolean): UnifiedPlan {
  const l = dbPlan.limits;
  const f = dbPlan.features;
  const m = dbPlan.models;

  return {
    id: dbPlan.id,
    slug: dbPlan.slug,
    name: dbPlan.name,
    displayName: dbPlan.displayName,
    description: dbPlan.description,
    pricing: dbPlan.pricing,
    paymentType: dbPlan.paymentType ?? "manual",
    stripePriceIdMonthly: dbPlan.stripePriceIdMonthly ?? null,
    stripePriceIdYearly: dbPlan.stripePriceIdYearly ?? null,
    limits: {
      models: {
        allowed: m?.allowed ?? ["*"],
        default: m?.default ?? "groq-llama-3.1-8b",
        limits: m?.limits ?? {}
      },
      chats: l?.chats ?? { maxActive: 100, maxHistory: 1000 },
      messages: l?.messages ?? { maxPerChat: 1000, maxPerDay: 100, maxPerMonth: 3000 },
      files: l?.files ?? { maxSize: 10, maxCount: 10, allowedTypes: ["*"] },
      api: l?.api ?? { rateLimit: 100, burstLimit: 20 },
      features: {
        mcpServers: {
          enabled: f?.mcpServers?.enabled ?? false,
          maxServers: f?.mcpServers?.maxServers ?? 0,
          customServers: f?.mcpServers?.customServers ?? false
        },
        workflows: {
          enabled: f?.workflows?.enabled ?? false,
          maxWorkflows: f?.workflows?.maxWorkflows ?? 0
        },
        agents: {
          enabled: f?.agents?.enabled ?? false,
          maxCustomAgents: f?.agents?.maxCustomAgents ?? 0,
          shareAgents: f?.agents?.shareAgents ?? false
        },
        advanced: {
          codeInterpreter: f?.advanced?.codeInterpreter ?? false,
          imageGeneration: f?.advanced?.imageGeneration ?? false,
          voiceChat: f?.advanced?.voiceChat ?? false,
          documentAnalysis: f?.advanced?.documentAnalysis ?? false,
          apiAccess: f?.advanced?.apiAccess ?? false,
          prioritySupport: f?.advanced?.prioritySupport ?? false,
          teamWorkspace: f?.advanced?.teamWorkspace ?? false,
          exportData: f?.advanced?.exportData ?? false
        }
      }
    },
    isBuiltIn: dbPlan.isBuiltIn ?? false,
    isActive,
    metadata: dbPlan.metadata ?? { order: 99, color: "gray", icon: "star" }
  };
}

export async function getUserPlan(userId: string): Promise<UnifiedPlan | null> {
  try {
    const [user] = await db
      .select({
        plan: UserTable.plan,
        planId: UserTable.planId,
        planStatus: UserTable.planStatus,
        planExpiresAt: UserTable.planExpiresAt,
      })
      .from(UserTable)
      .where(eq(UserTable.id, userId))
      .limit(1);

    if (!user) return null;

    const isActive =
      user.planStatus !== "expired" &&
      (!user.planExpiresAt || new Date(user.planExpiresAt) > new Date());

    if (user.planId) {
      const [dbPlan] = await db
        .select()
        .from(SubscriptionPlanTable)
        .where(eq(SubscriptionPlanTable.id, user.planId))
        .limit(1);

      if (dbPlan) {
        return mapDbPlanToUnified(dbPlan, isActive);
      }
    }

    const planSlug = (user.plan || "free") as SubscriptionPlan;
    const validSlugs: SubscriptionPlan[] = ["free", "basic", "pro", "enterprise"];
    const safeSlug = validSlugs.includes(planSlug) ? planSlug : "free";
    return mapHardcodedPlanToUnified(safeSlug, isActive);
  } catch (error) {
    console.error("Error getting user plan:", error);
    return mapHardcodedPlanToUnified("free", true);
  }
}

export async function getBuiltInPlan(slug: string): Promise<UnifiedPlan | null> {
  if (!PLANS[slug as SubscriptionPlan]) return null;
  return mapHardcodedPlanToUnified(slug as SubscriptionPlan, true);
}

export async function getPlanFromDb(planId: string): Promise<UnifiedPlan | null> {
  try {
    const [dbPlan] = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.id, planId))
      .limit(1);
    if (!dbPlan) return null;
    return mapDbPlanToUnified(dbPlan, true);
  } catch {
    return null;
  }
}

export async function getActivePlans(): Promise<UnifiedPlan[]> {
  try {
    const dbPlans = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.isBuiltIn, false));

    const customPlans = dbPlans
      .filter((p) => p.adminSettings?.isActive)
      .map((p) => mapDbPlanToUnified(p, true));

    const builtInPlans: UnifiedPlan[] = [
      mapHardcodedPlanToUnified("free", true),
      mapHardcodedPlanToUnified("basic", true),
      mapHardcodedPlanToUnified("pro", true),
      mapHardcodedPlanToUnified("enterprise", true),
    ];

    return [...builtInPlans, ...customPlans];
  } catch {
    return [
      mapHardcodedPlanToUnified("free", true),
      mapHardcodedPlanToUnified("basic", true),
      mapHardcodedPlanToUnified("pro", true),
      mapHardcodedPlanToUnified("enterprise", true),
    ];
  }
}

export async function getPlanById(planId: string): Promise<UnifiedPlan | null> {
  const dbPlan = await getPlanFromDb(planId);
  if (dbPlan) return dbPlan;
  return getBuiltInPlan(planId);
}

export async function getPlanBySlug(slug: string): Promise<UnifiedPlan | null> {
  try {
    const [dbPlan] = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.slug, slug))
      .limit(1);
    if (dbPlan) return mapDbPlanToUnified(dbPlan, true);
  } catch {}
  return getBuiltInPlan(slug);
}

export function invalidatePlansCache() {}

export function isUnlimited(value: number): boolean {
  return value === -1;
}
