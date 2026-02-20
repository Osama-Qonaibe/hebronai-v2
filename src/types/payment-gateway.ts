export interface PaymentGateway {
  id: string;
  name: string;
  provider: 'stripe' | 'paypal' | 'bank_transfer' | 'custom';
  displayName: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  logoUrl: string | null;
  isActive: boolean;
  isTestMode: boolean;
  config: PaymentGatewayConfig;
  features: {
    recurring: boolean;
    refunds: boolean;
    webhooks: boolean;
  };
  supportedMethods: string[];
  webhookEvents: string[];
  lastTestAt: Date | null;
  testResult: TestResult | null;
  displayOrder: number;
  countryRestrictions: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentGatewayConfig {
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
  webhookUrl?: string;
  supportedCurrencies: string[];
  metadata?: Record<string, any>;
}

export interface TestResult {
  success: boolean;
  message: string;
  testedAt: Date;
  responseTime?: number;
  errors?: string[];
}

export interface PaymentGatewayFormData {
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
  logoUrl: string;
  isActive: boolean;
  isTestMode: boolean;
  config: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
    supportedCurrencies: string[];
  };
  features: {
    recurring: boolean;
    refunds: boolean;
    webhooks: boolean;
  };
  supportedMethods: string[];
  displayOrder: number;
  countryRestrictions: string[];
}

export interface GatewayTestRequest {
  gatewayId: string;
  testAmount?: number;
  testCurrency?: string;
}

export interface GatewayTestResponse {
  success: boolean;
  message: string;
  responseTime: number;
  details?: any;
}

export interface PlanGatewayPricing {
  [gatewayId: string]: {
    monthly: number;
    yearly: number;
    setupFee?: number;
    processingFee?: number;
  };
}
