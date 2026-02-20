export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  displayName: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  pricing: {
    monthly: number;
    yearly: number;
    currency: string;
    discount?: { yearly: number };
  };
  models: {
    allowed: string[];
    default: string;
    limits: {
      [key: string]: {
        maxTokensPerRequest: number;
        maxRequestsPerDay: number;
        maxTokensPerMonth: number;
      };
    };
  };
  limits: {
    chats: { maxActive: number; maxHistory: number };
    messages: {
      maxPerChat: number;
      maxPerDay: number;
      maxPerMonth: number;
    };
    files: { maxSize: number; maxCount: number; allowedTypes: string[] };
    images: {
      maxPerDay: number;
      maxPerMonth: number;
      maxResolution: string;
    };
    api: { rateLimit: number; burstLimit: number };
  };
  features: {
    mcpServers: {
      enabled: boolean;
      maxServers: number;
      customServers: boolean;
    };
    workflows: { enabled: boolean; maxWorkflows: number };
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
  adminSettings: {
    isActive: boolean;
    isVisible: boolean;
    isFeatured: boolean;
    allowSignup: boolean;
    maxUsers: number | null;
    trialDays: number;
  };
  metadata: {
    order: number;
    badge?: string;
    color: string;
    icon: string;
  };
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentGateway {
  id: string;
  name: string;
  provider: string;
  isActive: boolean;
  isTestMode: boolean;
  config: {
    publicKey: string;
    secretKey: string;
    webhookSecret?: string;
    webhookUrl?: string;
    supportedCurrencies: string[];
    metadata?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}
