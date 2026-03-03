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
  modelsCount?: number;
  featuredModels?: string[];
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
    modelsCount: 10,
    featuredModels: ["Groq Models", "Ollama Models"],
    features: [
      "features.2CustomAgents",
      "features.1Workflow",
      "features.1McpServer",
      "features.50000TokensMonth",
      "features.noImages",
      "features.500MBStorage",
      "features.10ModelsAvailable",
      "features.freeModelsOnly",
      "features.groqOllamaModels",
      "features.basicChat",
      "features.limitedCodeInterpreter",
      "features.5DocumentsMonth",
      "features.100APICallsDay",
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
    modelsCount: 13,
    featuredModels: ["GPT-5 Nano", "Gemini 2.5 Flash Lite", "DeepSeek v3"],
    features: [
      "features.5CustomAgents",
      "features.3Workflows",
      "features.2McpServers",
      "features.300000TokensMonth",
      "features.5ImagesDay150Month",
      "features.3GBStorage",
      "features.13ModelsAvailable",
      "features.allFreeModels",
      "features.gpt5NanoAccess",
      "features.geminiFlashLiteAccess",
      "features.deepseekAccess",
      "features.advancedChat",
      "features.fullCodeInterpreter",
      "features.20DocumentsMonth",
      "features.imageGeneration",
      "features.workflowAutomation",
      "features.exportChat",
      "features.priorityQueue",
      "features.500APICallsDay",
      "features.emailSupport48h",
    ],
  },
  pro: {
    name: "pro",
    displayName: "Pro",
    price: 24.99,
    priceDisplay: "$24.99",
    period: "month",
    limits: PLAN_LIMITS.pro,
    modelsCount: 21,
    featuredModels: [
      "GPT-5 Mini",
      "Gemini 2.5 Pro",
      "Grok 4-1 Fast",
      "Claude Haiku 4.5",
    ],
    features: [
      "features.20CustomAgents",
      "features.10Workflows",
      "features.5McpServers",
      "features.1500000TokensMonth",
      "features.15ImagesDay450Month",
      "features.15GBStorage",
      "features.21ModelsAvailable",
      "features.allBasicModels",
      "features.gpt5MiniAccess",
      "features.gpt41Access",
      "features.geminiProAccess",
      "features.grokAccess",
      "features.claudeHaikuAccess",
      "features.llama405bAccess",
      "features.professionalChat",
      "features.unlimitedCodeInterpreter",
      "features.100DocumentsMonth",
      "features.advancedImageGeneration",
      "features.30MinutesVoiceChat",
      "features.apiAccess2000Day",
      "features.exportAllFormats",
      "features.advancedAnalytics",
      "features.customAgentSharing",
      "features.prioritySupport12h",
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
    modelsCount: 45,
    featuredModels: [
      "GPT-5.2 Pro",
      "Claude Opus 4.5",
      "Grok 4-1",
      "Sora 2 Pro",
    ],
    features: [
      "features.unlimitedAgents",
      "features.unlimitedWorkflows",
      "features.unlimitedMcpServers",
      "features.unlimitedTokens",
      "features.unlimitedImagesDay",
      "features.100GBPlusStorage",
      "features.45PlusModelsAvailable",
      "features.allProModels",
      "features.gpt52ProAccess",
      "features.gpt51Access",
      "features.o3o4Access",
      "features.gemini3ProAccess",
      "features.opusAccess",
      "features.sonnetAccess",
      "features.grok4Access",
      "features.dalleAccess",
      "features.soraProAccess",
      "features.whisperAccess",
      "features.ttsHDAccess",
      "features.unlimitedVoiceChat",
      "features.unlimitedApiAccess",
      "features.teamWorkspace",
      "features.customIntegration",
      "features.whiteLabelOption",
      "features.dedicatedInfrastructure",
      "features.onPremiseOption",
      "features.slaGuarantee999",
      "features.advancedSecurity",
      "features.auditLogs",
      "features.ssoSaml",
      "features.dedicatedAccountManager",
      "features.support24_7",
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

export function formatTokenCount(count: number): string {
  if (count === -1) return "Unlimited";
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toLocaleString('en-US', { maximumFractionDigits: 0 })}K`;
  }
  return count.toLocaleString('en-US');
}

export function formatStorageSize(gb: number): string {
  if (gb === -1) return "Unlimited";
  if (gb < 1) {
    return `${(gb * 1024).toFixed(0)} MB`;
  }
  return `${gb.toLocaleString('en-US')} GB`;
}
