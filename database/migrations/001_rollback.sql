-- ============================================================================
-- HebronAI v2 - Rollback Migration Script
-- ============================================================================
-- Description: Rollback script to drop all tables created in 001_complete_schema.sql
-- Version: 3.4.0
-- Date: 2026-02-17
-- 
-- WARNING: This script will permanently delete ALL data in the database!
-- Use with extreme caution and only if you need to completely reset the database.
-- ============================================================================

-- Drop all triggers first
DROP TRIGGER IF EXISTS update_subscription_plan_updated_at ON subscription_plan;
DROP TRIGGER IF EXISTS update_user_updated_at ON "user";
DROP TRIGGER IF EXISTS update_payment_gateway_updated_at ON payment_gateway;
DROP TRIGGER IF EXISTS update_subscription_request_updated_at ON subscription_request;
DROP TRIGGER IF EXISTS update_session_updated_at ON session;
DROP TRIGGER IF EXISTS update_account_updated_at ON account;
DROP TRIGGER IF EXISTS update_verification_updated_at ON verification;
DROP TRIGGER IF EXISTS update_agent_updated_at ON agent;
DROP TRIGGER IF EXISTS update_mcp_server_updated_at ON mcp_server;
DROP TRIGGER IF EXISTS update_mcp_tool_custom_updated_at ON mcp_server_tool_custom_instructions;
DROP TRIGGER IF EXISTS update_mcp_server_custom_updated_at ON mcp_server_custom_instructions;
DROP TRIGGER IF EXISTS update_mcp_oauth_session_updated_at ON mcp_oauth_session;
DROP TRIGGER IF EXISTS update_workflow_updated_at ON workflow;
DROP TRIGGER IF EXISTS update_workflow_node_updated_at ON workflow_node;
DROP TRIGGER IF EXISTS update_archive_updated_at ON archive;
DROP TRIGGER IF EXISTS update_chat_export_comment_updated_at ON chat_export_comment;
DROP TRIGGER IF EXISTS update_daily_usage_summary_updated_at ON daily_usage_summary;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop all tables in reverse order (respecting foreign key dependencies)
DROP TABLE IF EXISTS daily_usage_summary CASCADE;
DROP TABLE IF EXISTS image_generation CASCADE;
DROP TABLE IF EXISTS usage CASCADE;
DROP TABLE IF EXISTS chat_export_comment CASCADE;
DROP TABLE IF EXISTS chat_export CASCADE;
DROP TABLE IF EXISTS archive_item CASCADE;
DROP TABLE IF EXISTS archive CASCADE;
DROP TABLE IF EXISTS bookmark CASCADE;
DROP TABLE IF EXISTS workflow_edge CASCADE;
DROP TABLE IF EXISTS workflow_node CASCADE;
DROP TABLE IF EXISTS workflow CASCADE;
DROP TABLE IF EXISTS mcp_oauth_session CASCADE;
DROP TABLE IF EXISTS mcp_server_custom_instructions CASCADE;
DROP TABLE IF EXISTS mcp_server_tool_custom_instructions CASCADE;
DROP TABLE IF EXISTS mcp_server CASCADE;
DROP TABLE IF EXISTS agent CASCADE;
DROP TABLE IF EXISTS chat_message CASCADE;
DROP TABLE IF EXISTS chat_thread CASCADE;
DROP TABLE IF EXISTS verification CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS session CASCADE;
DROP TABLE IF EXISTS subscription_request CASCADE;
DROP TABLE IF EXISTS payment_gateway CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;
DROP TABLE IF EXISTS subscription_plan CASCADE;

-- Drop UUID extension (optional, only if not used by other databases)
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- ============================================================================
-- ROLLBACK COMPLETE
-- ============================================================================
-- All tables, triggers, and functions have been dropped.
-- The database has been reset to its initial state.
-- ============================================================================
