export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'other';
  displayName: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  isActive: boolean;
  isVisible: boolean;
  pricing: {
    input: number;
    output: number;
    currency: string;
  };
  capabilities: string[];
  maxTokens: number | null;
  contextWindow: number | null;
  supportsVision: boolean;
  supportsFunctionCalling: boolean;
  supportsStreaming: boolean;
  metadata: Record<string, any>;
  lastSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanModelAccess {
  id: string;
  planId: string;
  modelId: string;
  isDefault: boolean;
  customLimits: {
    maxTokensPerRequest: number | null;
    maxRequestsPerDay: number | null;
    maxTokensPerMonth: number | null;
  };
  createdAt: Date;
}

export interface ModelSyncLog {
  id: string;
  provider: string;
  modelsSynced: number;
  modelsAdded: number;
  modelsUpdated: number;
  status: 'success' | 'failed' | 'partial';
  errorMessage: string | null;
  syncedAt: Date;
}

export interface ModelSyncRequest {
  providers?: ('openai' | 'anthropic' | 'google')[];
  forceUpdate?: boolean;
}

export interface ModelSyncResponse {
  success: boolean;
  totalSynced: number;
  added: number;
  updated: number;
  failed: number;
  logs: ModelSyncLog[];
}

export interface ModelFormData {
  name: string;
  provider: string;
  displayName: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  isActive: boolean;
  isVisible: boolean;
  pricing: {
    input: number;
    output: number;
    currency: string;
  };
  maxTokens: number | null;
  contextWindow: number | null;
  supportsVision: boolean;
  supportsFunctionCalling: boolean;
  supportsStreaming: boolean;
}
