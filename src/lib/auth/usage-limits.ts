import "server-only";
import { getUserSubscription } from "./subscription";
import { getPlanLimits } from "../subscription/plans";
import { pgDb as db } from "lib/db/pg/db.pg";
import { AgentTable, WorkflowTable, McpServerTable } from "lib/db/pg/schema.pg";
import { eq, count } from "drizzle-orm";

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  current?: number;
  max?: number;
}

/**
 * Check if user can create a new agent
 */
export async function checkAgentCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const subscription = await getUserSubscription();

  if (!subscription?.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active",
    };
  }

  const limits = getPlanLimits(subscription.plan);

  // -1 means unlimited (enterprise plan)
  if (limits.maxAgents === -1) {
    return { allowed: true };
  }

  // Count current agents
  const [result] = await db
    .select({ count: count() })
    .from(AgentTable)
    .where(eq(AgentTable.userId, userId));

  const currentCount = result?.count || 0;

  if (currentCount >= limits.maxAgents) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of agents (${limits.maxAgents}) for your ${subscription.plan} plan. Please upgrade to create more agents.`,
      current: currentCount,
      max: limits.maxAgents,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: limits.maxAgents,
  };
}

/**
 * Check if user can create a new workflow
 */
export async function checkWorkflowCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const subscription = await getUserSubscription();

  if (!subscription?.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active",
    };
  }

  const limits = getPlanLimits(subscription.plan);

  if (limits.maxWorkflows === -1) {
    return { allowed: true };
  }

  const [result] = await db
    .select({ count: count() })
    .from(WorkflowTable)
    .where(eq(WorkflowTable.userId, userId));

  const currentCount = result?.count || 0;

  if (currentCount >= limits.maxWorkflows) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of workflows (${limits.maxWorkflows}) for your ${subscription.plan} plan. Please upgrade to create more workflows.`,
      current: currentCount,
      max: limits.maxWorkflows,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: limits.maxWorkflows,
  };
}

/**
 * Check if user can create a new MCP server
 */
export async function checkMCPServerCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const subscription = await getUserSubscription();

  if (!subscription?.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active",
    };
  }

  const limits = getPlanLimits(subscription.plan);

  if (limits.maxMCPServers === -1) {
    return { allowed: true };
  }

  const [result] = await db
    .select({ count: count() })
    .from(McpServerTable)
    .where(eq(McpServerTable.userId, userId));

  const currentCount = result?.count || 0;

  if (currentCount >= limits.maxMCPServers) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of MCP servers (${limits.maxMCPServers}) for your ${subscription.plan} plan. Please upgrade to add more servers.`,
      current: currentCount,
      max: limits.maxMCPServers,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: limits.maxMCPServers,
  };
}

/**
 * Get all usage limits and current usage for a user
 */
export async function getUserUsageLimits(userId: string) {
  const subscription = await getUserSubscription();

  if (!subscription) {
    return null;
  }

  const limits = getPlanLimits(subscription.plan);

  const [agentsCount] = await db
    .select({ count: count() })
    .from(AgentTable)
    .where(eq(AgentTable.userId, userId));

  const [workflowsCount] = await db
    .select({ count: count() })
    .from(WorkflowTable)
    .where(eq(WorkflowTable.userId, userId));

  const [mcpServersCount] = await db
    .select({ count: count() })
    .from(McpServerTable)
    .where(eq(McpServerTable.userId, userId));

  return {
    plan: subscription.plan,
    isActive: subscription.isActive,
    expiresAt: subscription.expiresAt,
    limits: {
      agents: {
        current: agentsCount?.count || 0,
        max: limits.maxAgents,
        percentage:
          limits.maxAgents === -1
            ? 0
            : ((agentsCount?.count || 0) / limits.maxAgents) * 100,
      },
      workflows: {
        current: workflowsCount?.count || 0,
        max: limits.maxWorkflows,
        percentage:
          limits.maxWorkflows === -1
            ? 0
            : ((workflowsCount?.count || 0) / limits.maxWorkflows) * 100,
      },
      mcpServers: {
        current: mcpServersCount?.count || 0,
        max: limits.maxMCPServers,
        percentage:
          limits.maxMCPServers === -1
            ? 0
            : ((mcpServersCount?.count || 0) / limits.maxMCPServers) * 100,
      },
      tokens: {
        current: 0, // TODO: implement token tracking
        max: limits.maxTokensPerMonth,
        percentage: 0,
      },
    },
  };
}
