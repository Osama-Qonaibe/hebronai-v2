export type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";

export interface PlanLimits {
  maxAgents: number;
  maxWorkflows: number;
  maxMCPServers: number;
  maxTokensPerMonth: number;
  maxImagesPerDay: number;
  maxImagesPerMonth: number;
  maxStorageGB: number;
}

export interface PlanDetails {
  name: SubscriptionPlan;
  displayName: string;
  price: number;
  priceDisplay: string;
  period: "month" | "year" | "forever";
  limits: PlanLimits;
  features: string[];
  popular?: boolean;
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  free: {
    maxAgents: 3,
    maxWorkflows: 2,
    maxMCPServers: 1,
    maxTokensPerMonth: 100_000,
    maxImagesPerDay: 5,
    maxImagesPerMonth: 50,
    maxStorageGB: 1,
  },
  basic: {
    maxAgents: 10,
    maxWorkflows: 5,
    maxMCPServers: 3,
    maxTokensPerMonth: 500_000,
    maxImagesPerDay: 15,
    maxImagesPerMonth: 200,
    maxStorageGB: 5,
  },
  pro: {
    maxAgents: 50,
    maxWorkflows: 20,
    maxMCPServers: 10,
    maxTokensPerMonth: 2_000_000,
    maxImagesPerDay: 40,
    maxImagesPerMonth: 800,
    maxStorageGB: 20,
  },
  enterprise: {
    maxAgents: -1,
    maxWorkflows: -1,
    maxMCPServers: -1,
    maxTokensPerMonth: -1,
    maxImagesPerDay: -1,
    maxImagesPerMonth: -1,
    maxStorageGB: -1,
  },
};

export const PLANS: Record<SubscriptionPlan, PlanDetails> = {
  free: {
    name: "free",
    displayName: "Free",
    price: 0,
    priceDisplay: "$0",
    period: "forever",
    limits: PLAN_LIMITS.free,
    features: [
      "features.3CustomAgents",
      "features.2Workflows",
      "features.1McpServer",
      "features.100kTokensMonth",
      "features.5ImagesDay",
      "features.1GBStorage",
      "features.communitySupport",
    ],
  },
  basic: {
    name: "basic",
    displayName: "Basic",
    price: 9,
    priceDisplay: "$9",
    period: "month",
    limits: PLAN_LIMITS.basic,
    features: [
      "features.10CustomAgents",
      "features.5Workflows",
      "features.3McpServers",
      "features.500kTokensMonth",
      "features.15ImagesDay",
      "features.5GBStorage",
      "features.emailSupport",
      "features.priorityQueue",
    ],
  },
  pro: {
    name: "pro",
    displayName: "Pro",
    price: 29,
    priceDisplay: "$29",
    period: "month",
    limits: PLAN_LIMITS.pro,
    features: [
      "features.50CustomAgents",
      "features.20Workflows",
      "features.10McpServers",
      "features.2mTokensMonth",
      "features.40ImagesDay",
      "features.20GBStorage",
      "features.prioritySupport",
      "features.advancedAnalytics",
      "features.teamCollaboration",
    ],
    popular: true,
  },
  enterprise: {
    name: "enterprise",
    displayName: "Enterprise",
    price: 0,
    priceDisplay: "Custom",
    period: "month",
    limits: PLAN_LIMITS.enterprise,
    features: [
      "features.unlimitedAgents",
      "features.unlimitedWorkflows",
      "features.unlimitedMcpServers",
      "features.unlimitedTokens",
      "features.unlimitedImages",
      "features.unlimitedStorage",
      "features.dedicatedSupport",
      "features.slaGuarantee",
      "features.customIntegration",
      "features.onPremiseOption",
    ],
  },
};

export function getPlanLimits(plan: SubscriptionPlan): PlanLimits {
  return PLAN_LIMITS[plan];
}

export function getPlanDetails(plan: SubscriptionPlan): PlanDetails {
  return PLANS[plan];
}

export function getAllPlans(): PlanDetails[] {
  return Object.values(PLANS);
}
