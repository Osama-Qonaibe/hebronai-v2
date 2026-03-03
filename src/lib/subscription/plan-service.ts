import "server-only";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import { UserTable } from "@/lib/db/pg/schema.pg";
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

function mapPlanToUnified(planSlug: SubscriptionPlan, isActive: boolean): UnifiedPlan {
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
    limits: {
      models: {
        allowed: modelConfig.allowed,
        default: modelConfig.default,
        limits: {}
      },
      chats: { maxActive: 100, maxHistory: 1000 },
      messages: { maxPerChat: 1000, maxPerDay: 1000, maxPerMonth: 30000 },
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

export async function getUserPlan(userId: string): Promise<UnifiedPlan | null> {
  try {
    const [user] = await db
      .select({
        plan: UserTable.plan,
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

    const planSlug = (user.plan || "free") as SubscriptionPlan;
    return mapPlanToUnified(planSlug, isActive);
  } catch (error) {
    console.error("Error getting user plan:", error);
    return mapPlanToUnified("free", true);
  }
}

export async function getBuiltInPlan(slug: string): Promise<UnifiedPlan | null> {
  if (!PLANS[slug as SubscriptionPlan]) return null;
  return mapPlanToUnified(slug as SubscriptionPlan, true);
}

export async function getActivePlans(): Promise<UnifiedPlan[]> {
  return [
    mapPlanToUnified("free", true),
    mapPlanToUnified("basic", true),
    mapPlanToUnified("pro", true),
    mapPlanToUnified("enterprise", true)
  ];
}

export async function getPlanById(planId: string): Promise<UnifiedPlan | null> {
  return getBuiltInPlan(planId);
}

export async function getPlanBySlug(slug: string): Promise<UnifiedPlan | null> {
  return getBuiltInPlan(slug);
}

export function invalidatePlansCache() {}

export function isUnlimited(value: number): boolean {
  return value === -1;
}
