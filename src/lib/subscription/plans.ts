export type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";

export interface PlanLimits {
  maxAgents: number;
  maxWorkflows: number;
  maxMCPServers: number;
  maxTokensPerMonth: number;
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
  },
  basic: {
    maxAgents: 10,
    maxWorkflows: 5,
    maxMCPServers: 3,
    maxTokensPerMonth: 500_000,
  },
  pro: {
    maxAgents: 50,
    maxWorkflows: 20,
    maxMCPServers: 10,
    maxTokensPerMonth: 2_000_000,
  },
  enterprise: {
    maxAgents: -1,
    maxWorkflows: -1,
    maxMCPServers: -1,
    maxTokensPerMonth: -1,
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
      "3 Custom Agents",
      "2 Workflows",
      "1 MCP Server",
      "100K Tokens/month",
      "Community Support",
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
      "10 Custom Agents",
      "5 Workflows",
      "3 MCP Servers",
      "500K Tokens/month",
      "Email Support",
      "Priority Queue",
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
      "50 Custom Agents",
      "20 Workflows",
      "10 MCP Servers",
      "2M Tokens/month",
      "Priority Support",
      "Advanced Analytics",
      "Team Collaboration",
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
      "Unlimited Agents",
      "Unlimited Workflows",
      "Unlimited MCP Servers",
      "Unlimited Tokens",
      "Dedicated Support",
      "SLA Guarantee",
      "Custom Integration",
      "On-Premise Option",
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
