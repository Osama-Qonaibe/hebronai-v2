import "server-only";
import { getUserSubscription } from "./subscription";
import { getPlanLimits } from "../subscription/plans";
import { pgDb as db } from "lib/db/pg/db.pg";
import {
  AgentTable,
  WorkflowTable,
  McpServerTable,
  ImageGenerationTable,
  UsageTable,
} from "lib/db/pg/schema.pg";
import { eq, count, and, gte, lt, sql } from "drizzle-orm";

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  current?: number;
  max?: number;
}

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

  if (limits.maxAgents === -1) {
    return { allowed: true };
  }

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

export async function checkImageGenerationLimit(
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

  if (limits.maxImagesPerDay === -1) {
    return { allowed: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [result] = await db
    .select({ count: count() })
    .from(ImageGenerationTable)
    .where(
      and(
        eq(ImageGenerationTable.userId, userId),
        gte(ImageGenerationTable.createdAt, today),
        lt(ImageGenerationTable.createdAt, tomorrow),
        eq(ImageGenerationTable.status, "completed"),
      ),
    );

  const currentCount = result?.count || 0;

  if (currentCount >= limits.maxImagesPerDay) {
    return {
      allowed: false,
      reason: `You have reached the daily image generation limit (${limits.maxImagesPerDay}) for your ${subscription.plan} plan. Limit resets tomorrow.`,
      current: currentCount,
      max: limits.maxImagesPerDay,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: limits.maxImagesPerDay,
  };
}

export async function checkMonthlyImageLimit(
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

  if (limits.maxImagesPerMonth === -1) {
    return { allowed: true };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [result] = await db
    .select({ count: count() })
    .from(ImageGenerationTable)
    .where(
      and(
        eq(ImageGenerationTable.userId, userId),
        gte(ImageGenerationTable.createdAt, startOfMonth),
        eq(ImageGenerationTable.status, "completed"),
      ),
    );

  const currentCount = result?.count || 0;

  if (currentCount >= limits.maxImagesPerMonth) {
    return {
      allowed: false,
      reason: `You have reached the monthly image generation limit (${limits.maxImagesPerMonth}) for your ${subscription.plan} plan. Please upgrade.`,
      current: currentCount,
      max: limits.maxImagesPerMonth,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: limits.maxImagesPerMonth,
  };
}

export async function checkTokenLimit(
  userId: string,
  tokensToUse: number,
): Promise<LimitCheckResult> {
  const subscription = await getUserSubscription();

  if (!subscription?.isActive) {
    return {
      allowed: false,
      reason: "Your subscription is not active",
    };
  }

  const limits = getPlanLimits(subscription.plan);

  if (limits.maxTokensPerMonth === -1) {
    return { allowed: true };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const [result] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "tokens"),
        gte(UsageTable.periodStart, startOfMonth),
        lt(UsageTable.periodEnd, endOfMonth),
      ),
    );

  const currentUsage = Number(result?.total || 0);
  const afterUsage = currentUsage + tokensToUse;

  if (afterUsage > limits.maxTokensPerMonth) {
    return {
      allowed: false,
      reason: `This request would exceed your monthly token limit (${limits.maxTokensPerMonth.toLocaleString()}) for your ${subscription.plan} plan.`,
      current: currentUsage,
      max: limits.maxTokensPerMonth,
    };
  }

  return {
    allowed: true,
    current: currentUsage,
    max: limits.maxTokensPerMonth,
  };
}

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

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [dailyImagesCount] = await db
    .select({ count: count() })
    .from(ImageGenerationTable)
    .where(
      and(
        eq(ImageGenerationTable.userId, userId),
        gte(ImageGenerationTable.createdAt, today),
        lt(ImageGenerationTable.createdAt, tomorrow),
        eq(ImageGenerationTable.status, "completed"),
      ),
    );

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [monthlyImagesCount] = await db
    .select({ count: count() })
    .from(ImageGenerationTable)
    .where(
      and(
        eq(ImageGenerationTable.userId, userId),
        gte(ImageGenerationTable.createdAt, startOfMonth),
        eq(ImageGenerationTable.status, "completed"),
      ),
    );

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const [tokensResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "tokens"),
        gte(UsageTable.periodStart, startOfMonth),
        lt(UsageTable.periodEnd, endOfMonth),
      ),
    );

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
      imagesDaily: {
        current: dailyImagesCount?.count || 0,
        max: limits.maxImagesPerDay,
        percentage:
          limits.maxImagesPerDay === -1
            ? 0
            : ((dailyImagesCount?.count || 0) / limits.maxImagesPerDay) * 100,
      },
      imagesMonthly: {
        current: monthlyImagesCount?.count || 0,
        max: limits.maxImagesPerMonth,
        percentage:
          limits.maxImagesPerMonth === -1
            ? 0
            : ((monthlyImagesCount?.count || 0) / limits.maxImagesPerMonth) *
              100,
      },
      tokens: {
        current: Number(tokensResult?.total || 0),
        max: limits.maxTokensPerMonth,
        percentage:
          limits.maxTokensPerMonth === -1
            ? 0
            : (Number(tokensResult?.total || 0) / limits.maxTokensPerMonth) *
              100,
      },
    },
  };
}
