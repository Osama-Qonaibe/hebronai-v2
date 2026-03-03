export type SubscriptionPlan = "free" | "basic" | "pro" | "enterprise";

export interface PlanLimits {
  maxAgents: number;
  maxWorkflows: number;
  maxMCPServers: number;
  maxTokensPerMonth: number;
  maxImagesPerDay: number;
  maxImagesPerMonth: number;
  maxStorageGB: number;
  maxAPICallsPerDay: number;
  maxDocumentsPerMonth: number;
  maxVoiceMinutesPerMonth: number;
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
    maxAgents: 2,
    maxWorkflows: 1,
    maxMCPServers: 1,
    maxTokensPerMonth: 50_000,
    maxImagesPerDay: 0,
    maxImagesPerMonth: 0,
    maxStorageGB: 0.5,
    maxAPICallsPerDay: 100,
    maxDocumentsPerMonth: 5,
    maxVoiceMinutesPerMonth: 0,
  },
  basic: {
    maxAgents: 5,
    maxWorkflows: 3,
    maxMCPServers: 2,
    maxTokensPerMonth: 300_000,
    maxImagesPerDay: 5,
    maxImagesPerMonth: 150,
    maxStorageGB: 3,
    maxAPICallsPerDay: 500,
    maxDocumentsPerMonth: 20,
    maxVoiceMinutesPerMonth: 0,
  },
  pro: {
    maxAgents: 20,
    maxWorkflows: 10,
    maxMCPServers: 5,
    maxTokensPerMonth: 1_500_000,
    maxImagesPerDay: 15,
    maxImagesPerMonth: 450,
    maxStorageGB: 15,
    maxAPICallsPerDay: 2_000,
    maxDocumentsPerMonth: 100,
    maxVoiceMinutesPerMonth: 30,
  },
  enterprise: {
    maxAgents: -1,
    maxWorkflows: -1,
    maxMCPServers: -1,
    maxTokensPerMonth: -1,
    maxImagesPerDay: -1,
    maxImagesPerMonth: -1,
    maxStorageGB: -1,
    maxAPICallsPerDay: -1,
    maxDocumentsPerMonth: -1,
    maxVoiceMinutesPerMonth: -1,
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
      "features.2CustomAgents",
      "features.1Workflow",
      "features.1McpServer",
      "features.50kTokensMonth",
      "features.noImages",
      "features.500MBStorage",
      "features.freeModelsOnly",
      "features.basicChat",
      "features.limitedCodeInterpreter",
      "features.5DocumentsMonth",
      "features.communitySupport",
    ],
  },
  basic: {
    name: "basic",
    displayName: "Basic",
    price: 9.99,
    priceDisplay: "$9.99",
    period: "month",
    limits: PLAN_LIMITS.basic,
    features: [
      "features.5CustomAgents",
      "features.3Workflows",
      "features.2McpServers",
      "features.300kTokensMonth",
      "features.5ImagesDay",
      "features.3GBStorage",
      "features.gpt5NanoAccess",
      "features.allFreeModels",
      "features.advancedChat",
      "features.fullCodeInterpreter",
      "features.20DocumentsMonth",
      "features.imageGeneration",
      "features.exportChat",
      "features.priorityQueue",
      "features.emailSupport",
    ],
  },
  pro: {
    name: "pro",
    displayName: "Pro",
    price: 24.99,
    priceDisplay: "$24.99",
    period: "month",
    limits: PLAN_LIMITS.pro,
    features: [
      "features.20CustomAgents",
      "features.10Workflows",
      "features.5McpServers",
      "features.1500kTokensMonth",
      "features.15ImagesDay",
      "features.15GBStorage",
      "features.powerfulModels",
      "features.gpt5MiniAccess",
      "features.grokAccess",
      "features.geminiProAccess",
      "features.professionalChat",
      "features.unlimitedCodeInterpreter",
      "features.100DocumentsMonth",
      "features.advancedImageGeneration",
      "features.30MinutesVoiceChat",
      "features.apiAccess",
      "features.exportAllFormats",
      "features.advancedAnalytics",
      "features.customAgentSharing",
      "features.prioritySupport",
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
      "features.allModels",
      "features.gpt52Access",
      "features.opusAccess",
      "features.grok4Access",
      "features.soraAccess",
      "features.unlimitedVoiceChat",
      "features.unlimitedApiAccess",
      "features.teamWorkspace",
      "features.customIntegration",
      "features.whiteLabelOption",
      "features.dedicatedInfrastructure",
      "features.onPremiseOption",
      "features.slaGuarantee",
      "features.advancedSecurity",
      "features.auditLogs",
      "features.ssoSaml",
      "features.dedicatedSupport",
      "features.accountManager",
      "features.phoneSupport",
      "features.customTraining",
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
