-- Migration: Seed Built-in Subscription Plans
-- This migration adds the 4 core subscription plans that are part of HebronAI's base product
-- These plans are protected and cannot be deleted from the admin panel

-- Insert Free Plan
INSERT INTO subscription_plan (
  id,
  name,
  slug,
  is_built_in,
  display_name,
  description,
  pricing,
  duration_value,
  duration_unit,
  models,
  limits,
  features,
  admin_settings,
  metadata,
  created_by,
  created_at,
  updated_at
) 
SELECT
  gen_random_uuid(),
  'Free',
  'free',
  true,
  '{"en": "Free", "ar": "مجاني"}'::jsonb,
  '{"en": "Perfect for trying out HebronAI", "ar": "مثالي لتجربة HebronAI"}'::jsonb,
  '{"monthly": 0, "yearly": 0, "currency": "USD"}'::jsonb,
  1,
  'months',
  '{"allowed": ["groq-models", "ollama-models"], "default": "groq-llama-3.3-70b", "limits": {"groq-models": {"maxTokensPerRequest": 8000, "maxRequestsPerDay": 100, "maxTokensPerMonth": 50000}}}'::jsonb,
  '{"chats": {"maxActive": 2, "maxHistory": 20}, "messages": {"maxPerChat": 50, "maxPerDay": 100, "maxPerMonth": 1500}, "files": {"maxSize": 0.5, "maxCount": 5, "allowedTypes": ["pdf", "txt", "md"]}, "api": {"rateLimit": 100, "burstLimit": 150}}'::jsonb,
  '{"mcpServers": {"enabled": true, "maxServers": 1, "customServers": false}, "workflows": {"enabled": true, "maxWorkflows": 1}, "agents": {"enabled": true, "maxCustomAgents": 2, "shareAgents": false}, "advanced": {"codeInterpreter": false, "imageGeneration": false, "voiceChat": false, "documentAnalysis": false, "apiAccess": false, "prioritySupport": false, "teamWorkspace": false, "exportData": false}}'::jsonb,
  '{"isActive": true, "isVisible": true, "isFeatured": false, "allowSignup": true, "maxUsers": null, "trialDays": 0}'::jsonb,
  '{"order": 1, "color": "#6B7280", "icon": "Zap"}'::jsonb,
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_plan WHERE slug = 'free' AND is_built_in = true
);

-- Insert Basic Plan
INSERT INTO subscription_plan (
  id,
  name,
  slug,
  is_built_in,
  display_name,
  description,
  pricing,
  duration_value,
  duration_unit,
  models,
  limits,
  features,
  admin_settings,
  metadata,
  created_by,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'Basic',
  'basic',
  true,
  '{"en": "Basic", "ar": "مبتدئ"}'::jsonb,
  '{"en": "For individuals and small projects", "ar": "للأفراد والمشاريع الصغيرة"}'::jsonb,
  '{"monthly": 9.99, "yearly": 99.9, "currency": "USD", "discount": {"yearly": 16.75}}'::jsonb,
  1,
  'months',
  '{"allowed": ["gpt-5-nano", "gemini-2.5-flash-lite", "deepseek-v3", "groq-models", "ollama-models"], "default": "gpt-5-nano", "limits": {"gpt-5-nano": {"maxTokensPerRequest": 16000, "maxRequestsPerDay": 150, "maxTokensPerMonth": 400000}, "gemini-2.5-flash-lite": {"maxTokensPerRequest": 32000, "maxRequestsPerDay": 100, "maxTokensPerMonth": 400000}}}'::jsonb,
  '{"chats": {"maxActive": 5, "maxHistory": 50}, "messages": {"maxPerChat": 100, "maxPerDay": 150, "maxPerMonth": 4500}, "files": {"maxSize": 2, "maxCount": 20, "allowedTypes": ["pdf", "txt", "md", "docx"]}, "api": {"rateLimit": 500, "burstLimit": 750}}'::jsonb,
  '{"mcpServers": {"enabled": true, "maxServers": 2, "customServers": false}, "workflows": {"enabled": true, "maxWorkflows": 3}, "agents": {"enabled": true, "maxCustomAgents": 5, "shareAgents": true}, "advanced": {"codeInterpreter": true, "imageGeneration": true, "voiceChat": false, "documentAnalysis": true, "apiAccess": true, "prioritySupport": false, "teamWorkspace": false, "exportData": true}}'::jsonb,
  '{"isActive": true, "isVisible": true, "isFeatured": false, "allowSignup": true, "maxUsers": null, "trialDays": 7}'::jsonb,
  '{"order": 2, "color": "#3B82F6", "icon": "Rocket"}'::jsonb,
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_plan WHERE slug = 'basic' AND is_built_in = true
);

-- Insert Pro Plan
INSERT INTO subscription_plan (
  id,
  name,
  slug,
  is_built_in,
  display_name,
  description,
  pricing,
  duration_value,
  duration_unit,
  models,
  limits,
  features,
  admin_settings,
  metadata,
  created_by,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'Pro',
  'pro',
  true,
  '{"en": "Pro", "ar": "محترف"}'::jsonb,
  '{"en": "For professionals and power users", "ar": "للمحترفين والمستخدمين المتقدمين"}'::jsonb,
  '{"monthly": 24.99, "yearly": 249.9, "currency": "USD", "discount": {"yearly": 16.67}}'::jsonb,
  1,
  'months',
  '{"allowed": ["gpt-5-mini", "gemini-2.5-pro", "grok-4.1-fast", "claude-haiku-4.5", "llama-4-405b", "gpt-5-nano", "gemini-2.5-flash-lite", "deepseek-v3", "groq-models", "ollama-models"], "default": "gpt-5-mini", "limits": {"gpt-5-mini": {"maxTokensPerRequest": 32000, "maxRequestsPerDay": 500, "maxTokensPerMonth": 2500000}, "gemini-2.5-pro": {"maxTokensPerRequest": 64000, "maxRequestsPerDay": 400, "maxTokensPerMonth": 2500000}, "claude-haiku-4.5": {"maxTokensPerRequest": 48000, "maxRequestsPerDay": 350, "maxTokensPerMonth": 2500000}}}'::jsonb,
  '{"chats": {"maxActive": 20, "maxHistory": 200}, "messages": {"maxPerChat": 500, "maxPerDay": 2000, "maxPerMonth": 60000}, "files": {"maxSize": 10, "maxCount": 100, "allowedTypes": ["*"]}, "api": {"rateLimit": 2000, "burstLimit": 3000}}'::jsonb,
  '{"mcpServers": {"enabled": true, "maxServers": 5, "customServers": true}, "workflows": {"enabled": true, "maxWorkflows": 10}, "agents": {"enabled": true, "maxCustomAgents": 20, "shareAgents": true}, "advanced": {"codeInterpreter": true, "imageGeneration": true, "voiceChat": true, "documentAnalysis": true, "apiAccess": true, "prioritySupport": true, "teamWorkspace": false, "exportData": true}}'::jsonb,
  '{"isActive": true, "isVisible": true, "isFeatured": true, "allowSignup": true, "maxUsers": null, "trialDays": 14}'::jsonb,
  '{"order": 3, "badge": "Most Popular", "color": "#8B5CF6", "icon": "Sparkles"}'::jsonb,
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_plan WHERE slug = 'pro' AND is_built_in = true
);

-- Insert Enterprise Plan
INSERT INTO subscription_plan (
  id,
  name,
  slug,
  is_built_in,
  display_name,
  description,
  pricing,
  duration_value,
  duration_unit,
  models,
  limits,
  features,
  admin_settings,
  metadata,
  created_by,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'Enterprise',
  'enterprise',
  true,
  '{"en": "Enterprise", "ar": "للشركات"}'::jsonb,
  '{"en": "Custom solutions for teams and organizations", "ar": "حلول مخصصة للفرق والشركات"}'::jsonb,
  '{"monthly": 0, "yearly": 0, "currency": "USD", "custom": true}'::jsonb,
  1,
  'months',
  '{"allowed": ["*"], "default": "gpt-5.2-pro", "limits": {"*": {"maxTokensPerRequest": -1, "maxRequestsPerDay": -1, "maxTokensPerMonth": -1}}}'::jsonb,
  '{"chats": {"maxActive": -1, "maxHistory": -1}, "messages": {"maxPerChat": -1, "maxPerDay": -1, "maxPerMonth": -1}, "files": {"maxSize": -1, "maxCount": -1, "allowedTypes": ["*"]}, "api": {"rateLimit": -1, "burstLimit": -1}}'::jsonb,
  '{"mcpServers": {"enabled": true, "maxServers": -1, "customServers": true}, "workflows": {"enabled": true, "maxWorkflows": -1}, "agents": {"enabled": true, "maxCustomAgents": -1, "shareAgents": true}, "advanced": {"codeInterpreter": true, "imageGeneration": true, "voiceChat": true, "documentAnalysis": true, "apiAccess": true, "prioritySupport": true, "teamWorkspace": true, "exportData": true}}'::jsonb,
  '{"isActive": true, "isVisible": true, "isFeatured": false, "allowSignup": false, "maxUsers": null, "trialDays": 30}'::jsonb,
  '{"order": 4, "badge": "Custom", "color": "#F59E0B", "icon": "Crown"}'::jsonb,
  (SELECT id FROM "user" WHERE role = 'admin' LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (
  SELECT 1 FROM subscription_plan WHERE slug = 'enterprise' AND is_built_in = true
);
