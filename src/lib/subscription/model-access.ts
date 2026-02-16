import type { SubscriptionPlan } from "./plans";

export type ModelTier = "free" | "basic" | "pro" | "enterprise";

export interface ModelAccessRule {
  provider: string;
  models: string[];
  tier: ModelTier;
  costPerMillionTokens?: number;
}

// Define all models with their access tier
export const MODEL_ACCESS_RULES: ModelAccessRule[] = [
  // ============================================
  // FREE TIER - Free models only
  // ============================================
  {
    provider: "google",
    models: ["gemini-2.5-flash-lite"],
    tier: "free",
    costPerMillionTokens: 0.075,
  },
  {
    provider: "groq",
    models: [
      "llama-4-scout-17b",
      "gpt-oss-20b",
      "gpt-oss-120b",
      "qwen3-32b",
      "kimi-k2-instruct",
    ],
    tier: "free",
    costPerMillionTokens: 0,
  },
  {
    provider: "ollama",
    models: [
      "deepseek-v3.1:671b-cloud",
      "qwen3-coder:480b-cloud",
      "gpt-oss:120b-cloud",
      "gpt-oss:20b-cloud",
      "kimi-k2:1t-cloud",
      "glm-4.6:cloud",
      "qwen3-vl:235b-cloud",
    ],
    tier: "free",
    costPerMillionTokens: 0,
  },
  {
    provider: "openRouter",
    models: ["deepseek-chat-v3", "mixtral-8x22b"],
    tier: "free",
    costPerMillionTokens: 0.14,
  },

  // ============================================
  // BASIC TIER - Affordable models
  // ============================================
  {
    provider: "openai",
    models: ["gpt-4.1-nano", "gpt-4.1-mini"],
    tier: "basic",
    costPerMillionTokens: 0.5,
  },
  {
    provider: "google",
    models: ["gemini-2.5-flash"],
    tier: "basic",
    costPerMillionTokens: 0.15,
  },
  {
    provider: "anthropic",
    models: ["haiku-4.5"],
    tier: "basic",
    costPerMillionTokens: 0.75,
  },
  {
    provider: "openRouter",
    models: ["llama-3.1-405b"],
    tier: "basic",
    costPerMillionTokens: 2.7,
  },

  // ============================================
  // PRO TIER - Powerful models
  // ============================================
  {
    provider: "openai",
    models: ["gpt-5-nano", "gpt-5-mini", "gpt-4.1"],
    tier: "pro",
    costPerMillionTokens: 5,
  },
  {
    provider: "google",
    models: ["gemini-2.5-pro"],
    tier: "pro",
    costPerMillionTokens: 3,
  },
  {
    provider: "xai",
    models: ["grok-3-mini", "grok-4-1-fast"],
    tier: "pro",
    costPerMillionTokens: 5,
  },

  // ============================================
  // ENTERPRISE TIER - All models
  // ============================================
  {
    provider: "openai",
    models: [
      "gpt-5.2-pro",
      "gpt-5.2",
      "gpt-5.2-chat",
      "gpt-5.2-codex",
      "gpt-5.1",
      "gpt-5.1-chat",
      "gpt-5.1-codex",
      "gpt-5.1-codex-mini",
      "o4-mini",
      "o3",
      "gpt-image-1.5",
      "dall-e-3",
      "sora-2-pro",
      "sora-2",
      "gpt-audio",
      "whisper",
      "tts-1-hd",
      "tts-1",
    ],
    tier: "enterprise",
    costPerMillionTokens: 15,
  },
  {
    provider: "google",
    models: ["gemini-3-pro"],
    tier: "enterprise",
    costPerMillionTokens: 5,
  },
  {
    provider: "anthropic",
    models: ["opus-4.5", "sonnet-4.5"],
    tier: "enterprise",
    costPerMillionTokens: 12,
  },
  {
    provider: "xai",
    models: ["grok-4-1"],
    tier: "enterprise",
    costPerMillionTokens: 10,
  },
  {
    provider: "openRouter",
    models: ["claude-3.5-sonnet", "auto"],
    tier: "enterprise",
    costPerMillionTokens: 9,
  },
];

// Map for quick access
const modelAccessMap = new Map<string, ModelTier>();
MODEL_ACCESS_RULES.forEach((rule) => {
  rule.models.forEach((model) => {
    const key = `${rule.provider}:${model}`;
    modelAccessMap.set(key, rule.tier);
  });
});

// Convert Plan to Tier
const PLAN_TO_TIER: Record<SubscriptionPlan, ModelTier> = {
  free: "free",
  basic: "basic",
  pro: "pro",
  enterprise: "enterprise",
};

// Tier hierarchy
const TIER_HIERARCHY: ModelTier[] = ["free", "basic", "pro", "enterprise"];

/**
 * Check if a user can access a specific model based on their subscription plan
 */
export function canAccessModel(
  userPlan: SubscriptionPlan,
  provider: string,
  model: string,
): boolean {
  const key = `${provider}:${model}`;
  const requiredTier = modelAccessMap.get(key);

  // If model not defined, allow access (for compatibility with new models)
  if (!requiredTier) {
    console.warn(`Model ${key} not found in access rules, allowing access`);
    return true;
  }

  const userTier = PLAN_TO_TIER[userPlan];
  const userTierIndex = TIER_HIERARCHY.indexOf(userTier);
  const requiredTierIndex = TIER_HIERARCHY.indexOf(requiredTier);

  return userTierIndex >= requiredTierIndex;
}

/**
 * Get all accessible models for a user's plan
 */
export function getAccessibleModels(
  userPlan: SubscriptionPlan,
): ModelAccessRule[] {
  const userTier = PLAN_TO_TIER[userPlan];
  const userTierIndex = TIER_HIERARCHY.indexOf(userTier);

  return MODEL_ACCESS_RULES.filter((rule) => {
    const ruleTierIndex = TIER_HIERARCHY.indexOf(rule.tier);
    return userTierIndex >= ruleTierIndex;
  });
}

/**
 * Get the cost per million tokens for a specific model
 */
export function getModelCost(provider: string, model: string): number {
  const rule = MODEL_ACCESS_RULES.find(
    (r) => r.provider === provider && r.models.includes(model),
  );
  return rule?.costPerMillionTokens || 0;
}

/**
 * Get the required tier for a model
 */
export function getRequiredTier(
  provider: string,
  model: string,
): ModelTier | null {
  const key = `${provider}:${model}`;
  return modelAccessMap.get(key) || null;
}

/**
 * Get the minimum plan required for a model
 */
export function getRequiredPlan(
  provider: string,
  model: string,
): SubscriptionPlan | null {
  const tier = getRequiredTier(provider, model);
  if (!tier) return null;

  const tierToPlan: Record<ModelTier, SubscriptionPlan> = {
    free: "free",
    basic: "basic",
    pro: "pro",
    enterprise: "enterprise",
  };

  return tierToPlan[tier];
}
