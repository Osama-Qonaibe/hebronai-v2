-- ============================================================================
-- HebronAI v2 - Complete Database Migration
-- ============================================================================
-- Description: Full database schema for HebronAI v2 platform
-- Version: 3.4.0
-- Date: 2026-02-17
-- 
-- This migration includes:
-- - User management with roles and permissions
-- - Subscription plans and requests
-- - Payment gateways
-- - Chat threads and messages
-- - AI Agents
-- - MCP Servers and customizations
-- - Workflows (nodes and edges)
-- - Archives and bookmarks
-- - Usage tracking and analytics
-- - Image generation
-- - OAuth sessions
-- - Chat exports and comments
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SUBSCRIPTION PLAN TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    display_name JSONB NOT NULL,  -- {en: string, ar: string}
    description JSONB NOT NULL,   -- {en: string, ar: string}
    pricing JSONB NOT NULL,       -- {monthly, yearly, currency, discount}
    models JSONB NOT NULL,        -- {allowed, default, limits}
    limits JSONB NOT NULL,        -- {chats, messages, files, api}
    features JSONB NOT NULL,      -- {mcpServers, workflows, agents, advanced}
    admin_settings JSONB NOT NULL, -- {isActive, isVisible, isFeatured, allowSignup, maxUsers, trialDays}
    metadata JSONB NOT NULL,      -- {order, badge, color, icon}
    created_by UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for subscription_plan
CREATE INDEX IF NOT EXISTS subscription_plan_slug_idx ON subscription_plan(slug);
CREATE INDEX IF NOT EXISTS subscription_plan_active_idx ON subscription_plan(((admin_settings->>'isActive')::boolean));

-- ============================================================================
-- 2. USER TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT false NOT NULL,
    password TEXT,
    image TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    banned BOOLEAN,
    ban_reason TEXT,
    ban_expires TIMESTAMP,
    role TEXT DEFAULT 'user' NOT NULL,
    plan_id UUID REFERENCES subscription_plan(id),
    plan VARCHAR(20) DEFAULT 'free' NOT NULL CHECK (plan IN ('free', 'basic', 'pro', 'enterprise')),
    plan_status VARCHAR(20) DEFAULT 'trial' NOT NULL CHECK (plan_status IN ('trial', 'active', 'expired')),
    plan_expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '30 days') NOT NULL
);

-- Add foreign key for subscription_plan.created_by
ALTER TABLE subscription_plan
ADD CONSTRAINT subscription_plan_created_by_fkey 
FOREIGN KEY (created_by) REFERENCES "user"(id);

-- ============================================================================
-- 3. PAYMENT GATEWAY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payment_gateway (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    provider TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false NOT NULL,
    is_test_mode BOOLEAN DEFAULT true NOT NULL,
    config JSONB NOT NULL,  -- {publicKey, secretKey, webhookSecret, webhookUrl, supportedCurrencies, metadata}
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 4. SUBSCRIPTION REQUEST TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscription_request (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    requested_plan_id UUID REFERENCES subscription_plan(id),
    requested_plan VARCHAR(20) NOT NULL CHECK (requested_plan IN ('free', 'basic', 'pro', 'enterprise')),
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'bank_transfer', 'manual')),
    amount NUMERIC(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'processing')),
    proof_image_url TEXT,
    transaction_id TEXT,
    stripe_session_id TEXT,
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_by UUID REFERENCES "user"(id),
    approved_at TIMESTAMP
);

-- Indexes for subscription_request
CREATE INDEX IF NOT EXISTS subscription_request_user_id_idx ON subscription_request(user_id);
CREATE INDEX IF NOT EXISTS subscription_request_status_idx ON subscription_request(status);

-- ============================================================================
-- 5. SESSION TABLE (for better-auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS session (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expires_at TIMESTAMP NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    impersonated_by TEXT
);

-- ============================================================================
-- 6. ACCOUNT TABLE (for OAuth providers)
-- ============================================================================
CREATE TABLE IF NOT EXISTS account (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    access_token TEXT,
    refresh_token TEXT,
    id_token TEXT,
    access_token_expires_at TIMESTAMP,
    refresh_token_expires_at TIMESTAMP,
    scope TEXT,
    password TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 7. VERIFICATION TABLE (for email verification, password reset)
-- ============================================================================
CREATE TABLE IF NOT EXISTS verification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 8. CHAT THREAD TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_thread (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 9. CHAT MESSAGE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_message (
    id TEXT PRIMARY KEY NOT NULL,
    thread_id UUID NOT NULL REFERENCES chat_thread(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    parts JSONB[] NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 10. AGENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon JSONB,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    instructions JSONB,
    visibility VARCHAR(20) DEFAULT 'private' NOT NULL CHECK (visibility IN ('public', 'private', 'readonly')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 11. MCP SERVER TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS mcp_server (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    config JSONB NOT NULL,
    enabled BOOLEAN DEFAULT true NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    visibility VARCHAR(20) DEFAULT 'private' NOT NULL CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 12. MCP TOOL CUSTOMIZATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS mcp_server_tool_custom_instructions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    tool_name TEXT NOT NULL,
    mcp_server_id UUID NOT NULL REFERENCES mcp_server(id) ON DELETE CASCADE,
    prompt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, tool_name, mcp_server_id)
);

-- ============================================================================
-- 13. MCP SERVER CUSTOMIZATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS mcp_server_custom_instructions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    mcp_server_id UUID NOT NULL REFERENCES mcp_server(id) ON DELETE CASCADE,
    prompt TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, mcp_server_id)
);

-- ============================================================================
-- 14. MCP OAUTH SESSION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS mcp_oauth_session (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mcp_server_id UUID NOT NULL REFERENCES mcp_server(id) ON DELETE CASCADE,
    server_url TEXT NOT NULL,
    client_info JSONB,
    tokens JSONB,
    code_verifier TEXT,
    state TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for mcp_oauth_session
CREATE INDEX IF NOT EXISTS mcp_oauth_session_server_id_idx ON mcp_oauth_session(mcp_server_id);
CREATE INDEX IF NOT EXISTS mcp_oauth_session_state_idx ON mcp_oauth_session(state);
CREATE INDEX IF NOT EXISTS mcp_oauth_session_tokens_idx ON mcp_oauth_session(mcp_server_id) WHERE tokens IS NOT NULL;

-- ============================================================================
-- 15. WORKFLOW TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workflow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version TEXT DEFAULT '0.1.0' NOT NULL,
    name TEXT NOT NULL,
    icon JSONB,
    description TEXT,
    is_published BOOLEAN DEFAULT false NOT NULL,
    visibility VARCHAR(20) DEFAULT 'private' NOT NULL CHECK (visibility IN ('public', 'private', 'readonly')),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 16. WORKFLOW NODE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workflow_node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version TEXT DEFAULT '0.1.0' NOT NULL,
    workflow_id UUID NOT NULL REFERENCES workflow(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    ui_config JSONB DEFAULT '{}',
    node_config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for workflow_node
CREATE INDEX IF NOT EXISTS workflow_node_kind_idx ON workflow_node(kind);

-- ============================================================================
-- 17. WORKFLOW EDGE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS workflow_edge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    version TEXT DEFAULT '0.1.0' NOT NULL,
    workflow_id UUID NOT NULL REFERENCES workflow(id) ON DELETE CASCADE,
    source UUID NOT NULL REFERENCES workflow_node(id) ON DELETE CASCADE,
    target UUID NOT NULL REFERENCES workflow_node(id) ON DELETE CASCADE,
    ui_config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 18. BOOKMARK TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS bookmark (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('agent', 'workflow', 'mcp')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, item_id, item_type)
);

-- Indexes for bookmark
CREATE INDEX IF NOT EXISTS bookmark_user_id_idx ON bookmark(user_id);
CREATE INDEX IF NOT EXISTS bookmark_item_idx ON bookmark(item_id, item_type);

-- ============================================================================
-- 19. ARCHIVE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS archive (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 20. ARCHIVE ITEM TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS archive_item (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    archive_id UUID NOT NULL REFERENCES archive(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index for archive_item
CREATE INDEX IF NOT EXISTS archive_item_item_id_idx ON archive_item(item_id);

-- ============================================================================
-- 21. CHAT EXPORT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_export (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    exporter_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    original_thread_id UUID,
    messages JSONB NOT NULL,
    exported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP
);

-- ============================================================================
-- 22. CHAT EXPORT COMMENT TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS chat_export_comment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    export_id UUID NOT NULL REFERENCES chat_export(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES chat_export_comment(id) ON DELETE CASCADE,
    content JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================================================
-- 23. USAGE TABLE (for tracking resource usage)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    resource_type VARCHAR(20) NOT NULL CHECK (resource_type IN ('tokens', 'api_calls', 'storage', 'images')),
    amount NUMERIC(15, 2) NOT NULL,
    metadata JSONB,
    period_start TIMESTAMP NOT NULL,
    period_end TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for usage
CREATE INDEX IF NOT EXISTS usage_user_id_idx ON usage(user_id);
CREATE INDEX IF NOT EXISTS usage_period_idx ON usage(period_start, period_end);
CREATE INDEX IF NOT EXISTS usage_resource_type_idx ON usage(resource_type);

-- ============================================================================
-- 24. IMAGE GENERATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS image_generation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    prompt TEXT NOT NULL,
    model TEXT NOT NULL,
    image_url TEXT,
    cost NUMERIC(10, 4),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes for image_generation
CREATE INDEX IF NOT EXISTS image_generation_user_id_idx ON image_generation(user_id);
CREATE INDEX IF NOT EXISTS image_generation_created_at_idx ON image_generation(created_at);
CREATE INDEX IF NOT EXISTS image_generation_status_idx ON image_generation(status);

-- ============================================================================
-- 25. DAILY USAGE SUMMARY TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS daily_usage_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    date TIMESTAMP NOT NULL,
    tokens_used INTEGER DEFAULT 0 NOT NULL,
    images_generated INTEGER DEFAULT 0 NOT NULL,
    storage_used_gb NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    api_calls INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, date)
);

-- Indexes for daily_usage_summary
CREATE INDEX IF NOT EXISTS daily_usage_user_id_idx ON daily_usage_summary(user_id);
CREATE INDEX IF NOT EXISTS daily_usage_date_idx ON daily_usage_summary(date);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_subscription_plan_updated_at BEFORE UPDATE ON subscription_plan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_gateway_updated_at BEFORE UPDATE ON payment_gateway FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_request_updated_at BEFORE UPDATE ON subscription_request FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_session_updated_at BEFORE UPDATE ON session FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_account_updated_at BEFORE UPDATE ON account FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_updated_at BEFORE UPDATE ON verification FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_updated_at BEFORE UPDATE ON agent FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mcp_server_updated_at BEFORE UPDATE ON mcp_server FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mcp_tool_custom_updated_at BEFORE UPDATE ON mcp_server_tool_custom_instructions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mcp_server_custom_updated_at BEFORE UPDATE ON mcp_server_custom_instructions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mcp_oauth_session_updated_at BEFORE UPDATE ON mcp_oauth_session FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_updated_at BEFORE UPDATE ON workflow FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_node_updated_at BEFORE UPDATE ON workflow_node FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_archive_updated_at BEFORE UPDATE ON archive FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_export_comment_updated_at BEFORE UPDATE ON chat_export_comment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_usage_summary_updated_at BEFORE UPDATE ON daily_usage_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- All tables, indexes, constraints, and triggers have been created successfully.
-- The database is now ready for HebronAI v2 application.
-- ============================================================================
