CREATE TABLE IF NOT EXISTS ai_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  display_name JSONB NOT NULL DEFAULT '{"en": "", "ar": ""}'::jsonb,
  description JSONB DEFAULT '{"en": "", "ar": ""}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  pricing JSONB DEFAULT '{"input": 0, "output": 0, "currency": "USD"}'::jsonb,
  capabilities TEXT[] DEFAULT ARRAY[]::TEXT[],
  max_tokens INTEGER,
  context_window INTEGER,
  supports_vision BOOLEAN DEFAULT false,
  supports_function_calling BOOLEAN DEFAULT false,
  supports_streaming BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ai_models_provider ON ai_models(provider);
CREATE INDEX IF NOT EXISTS idx_ai_models_active ON ai_models(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ai_models_name ON ai_models(name);

ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS display_name JSONB DEFAULT '{"en": "", "ar": ""}'::jsonb;
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS description JSONB DEFAULT '{"en": "", "ar": ""}'::jsonb;
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '{"recurring": false, "refunds": false, "webhooks": false}'::jsonb;
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS supported_methods TEXT[] DEFAULT ARRAY['card']::TEXT[];
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS webhook_events TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS last_test_at TIMESTAMP;
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS test_result JSONB;
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 1;
ALTER TABLE payment_gateway ADD COLUMN IF NOT EXISTS country_restrictions TEXT[];

CREATE INDEX IF NOT EXISTS idx_payment_gateway_active ON payment_gateway(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_payment_gateway_provider ON payment_gateway(provider);

ALTER TABLE subscription_plan ADD COLUMN IF NOT EXISTS allowed_payment_gateways UUID[];
ALTER TABLE subscription_plan ADD COLUMN IF NOT EXISTS preferred_gateway_id UUID REFERENCES payment_gateway(id);
ALTER TABLE subscription_plan ADD COLUMN IF NOT EXISTS gateway_pricing JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS plan_model_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES subscription_plan(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
  is_default BOOLEAN DEFAULT false,
  custom_limits JSONB DEFAULT '{"maxTokensPerRequest": null, "maxRequestsPerDay": null, "maxTokensPerMonth": null}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plan_id, model_id)
);

CREATE INDEX IF NOT EXISTS idx_plan_model_access_plan ON plan_model_access(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_model_access_model ON plan_model_access(model_id);

CREATE TABLE IF NOT EXISTS model_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  models_synced INTEGER DEFAULT 0,
  models_added INTEGER DEFAULT 0,
  models_updated INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  error_message TEXT,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_model_sync_log_provider ON model_sync_log(provider);
CREATE INDEX IF NOT EXISTS idx_model_sync_log_synced_at ON model_sync_log(synced_at DESC);

INSERT INTO ai_models (name, provider, display_name, description, is_active, pricing, max_tokens, context_window, supports_streaming)
VALUES 
  ('gpt-4o', 'openai', '{"en": "GPT-4o", "ar": "GPT-4o"}'::jsonb, '{"en": "Most advanced OpenAI model", "ar": "أحدث نموذج من OpenAI"}'::jsonb, true, '{"input": 0.005, "output": 0.015, "currency": "USD"}'::jsonb, 4096, 128000, true),
  ('gpt-4o-mini', 'openai', '{"en": "GPT-4o Mini", "ar": "GPT-4o ميني"}'::jsonb, '{"en": "Fast and affordable", "ar": "سريع واقتصادي"}'::jsonb, true, '{"input": 0.00015, "output": 0.0006, "currency": "USD"}'::jsonb, 16384, 128000, true),
  ('gpt-3.5-turbo', 'openai', '{"en": "GPT-3.5 Turbo", "ar": "GPT-3.5 تيربو"}'::jsonb, '{"en": "Fast and reliable", "ar": "سريع وموثوق"}'::jsonb, true, '{"input": 0.0005, "output": 0.0015, "currency": "USD"}'::jsonb, 4096, 16385, true),
  ('claude-3-5-sonnet-20241022', 'anthropic', '{"en": "Claude 3.5 Sonnet", "ar": "كلود 3.5 سونيت"}'::jsonb, '{"en": "Most intelligent Claude model", "ar": "أذكى نموذج كلود"}'::jsonb, true, '{"input": 0.003, "output": 0.015, "currency": "USD"}'::jsonb, 8192, 200000, true),
  ('claude-3-5-haiku-20241022', 'anthropic', '{"en": "Claude 3.5 Haiku", "ar": "كلود 3.5 هايكو"}'::jsonb, '{"en": "Fastest Claude model", "ar": "أسرع نموذج كلود"}'::jsonb, true, '{"input": 0.001, "output": 0.005, "currency": "USD"}'::jsonb, 8192, 200000, true),
  ('gemini-2.0-flash-exp', 'google', '{"en": "Gemini 2.0 Flash", "ar": "جيميني 2.0 فلاش"}'::jsonb, '{"en": "Google latest multimodal model", "ar": "أحدث نموذج متعدد الوسائط من جوجل"}'::jsonb, true, '{"input": 0, "output": 0, "currency": "USD"}'::jsonb, 8192, 1000000, true)
ON CONFLICT (name) DO NOTHING;

COMMENT ON TABLE ai_models IS 'Stores AI models from various providers with multilingual support';
COMMENT ON TABLE plan_model_access IS 'Links subscription plans with allowed AI models';
COMMENT ON TABLE model_sync_log IS 'Logs for AI model synchronization operations';
COMMENT ON COLUMN payment_gateway.display_name IS 'Multilingual display name (en/ar)';
COMMENT ON COLUMN payment_gateway.description IS 'Multilingual description (en/ar)';
