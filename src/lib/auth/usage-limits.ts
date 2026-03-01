import "server-only";
import { getUserPlan, isUnlimited } from "../subscription/plan-service";
import { pgDb as db } from "lib/db/pg/db.pg";
import {
  AgentTable,
  WorkflowTable,
  McpServerTable,
  ImageGenerationTable,
  UsageTable,
  ChatMessageTable,
  ChatThreadTable,
} from "lib/db/pg/schema.pg";
import { eq, count, and, gte, lt, sql } from "drizzle-orm";

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  current?: number;
  max?: number;
}

/**
 * ✅ Agents Limit
 */
export async function checkAgentCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  const maxAgents = plan.limits.features.agents.maxCustomAgents;

  if (isUnlimited(maxAgents)) {
    return { allowed: true };
  }

  const [result] = await db
    .select({ count: count() })
    .from(AgentTable)
    .where(eq(AgentTable.userId, userId));

  const currentCount = result?.count || 0;

  if (currentCount >= maxAgents) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of agents (${maxAgents}) for your ${plan.name} plan. Please upgrade.`,
      current: currentCount,
      max: maxAgents,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxAgents,
  };
}

/**
 * ✅ Workflows Limit
 */
export async function checkWorkflowCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  const maxWorkflows = plan.limits.features.workflows.maxWorkflows;

  if (isUnlimited(maxWorkflows)) {
    return { allowed: true };
  }

  const [result] = await db
    .select({ count: count() })
    .from(WorkflowTable)
    .where(eq(WorkflowTable.userId, userId));

  const currentCount = result?.count || 0;

  if (currentCount >= maxWorkflows) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of workflows (${maxWorkflows}) for your ${plan.name} plan.`,
      current: currentCount,
      max: maxWorkflows,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxWorkflows,
  };
}

/**
 * ✅ MCP Servers Limit
 */
export async function checkMCPServerCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  const maxServers = plan.limits.features.mcpServers.maxServers;

  if (isUnlimited(maxServers)) {
    return { allowed: true };
  }

  const [result] = await db
    .select({ count: count() })
    .from(McpServerTable)
    .where(eq(McpServerTable.userId, userId));

  const currentCount = result?.count || 0;

  if (currentCount >= maxServers) {
    return {
      allowed: false,
      reason: `You have reached the maximum number of MCP servers (${maxServers}) for your ${plan.name} plan.`,
      current: currentCount,
      max: maxServers,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxServers,
  };
}

/**
 * ✅ Messages Per Day Limit
 */
export async function checkDailyMessageLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  const maxPerDay = plan.limits.messages.maxPerDay;

  if (isUnlimited(maxPerDay)) {
    return { allowed: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [result] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ChatMessageTable)
    .leftJoin(
      ChatThreadTable,
      eq(ChatMessageTable.threadId, ChatThreadTable.id),
    )
    .where(
      and(
        eq(ChatThreadTable.userId, userId),
        gte(ChatMessageTable.createdAt, today),
        lt(ChatMessageTable.createdAt, tomorrow),
      ),
    );

  const currentCount = Number(result?.count || 0);

  if (currentCount >= maxPerDay) {
    return {
      allowed: false,
      reason: `Daily message limit (${maxPerDay}) reached. Resets tomorrow.`,
      current: currentCount,
      max: maxPerDay,
    };
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxPerDay,
  };
}

/**
 * ✅ Image Generation Daily Limit
 */
export async function checkImageGenerationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  // Check if image generation is enabled
  if (!plan.limits.features.advanced.imageGeneration) {
    return {
      allowed: false,
      reason: `Image generation is not available in your ${plan.name} plan.`,
    };
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

  // For now, allow unlimited images if feature is enabled
  // Can add specific limits later
  return {
    allowed: true,
    current: currentCount,
  };
}

/**
 * ✅ Token Limit للـ Model المحدد
 */
export async function checkTokenLimit(
  userId: string,
  modelName: string,
  tokensToUse: number,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  // تحقق من السماح بالـ Model
  if (!plan.limits.models.allowed.includes(modelName)) {
    return {
      allowed: false,
      reason: `Model "${modelName}" is not available in your ${plan.name} plan.`,
    };
  }

  const modelLimits = plan.limits.models.limits[modelName];
  if (!modelLimits) {
    return {
      allowed: false,
      reason: `No limits defined for model "${modelName}".`,
    };
  }

  const maxTokensPerMonth = modelLimits.maxTokensPerMonth;

  if (isUnlimited(maxTokensPerMonth)) {
    return { allowed: true };
  }

  // حساب الاستخدام الشهري
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
        sql`${UsageTable.metadata}->>'model' = ${modelName}`,
        gte(UsageTable.periodStart, startOfMonth),
        lt(UsageTable.periodStart, endOfMonth), // ✅ FIX: use periodStart for both
      ),
    );

  const currentUsage = Number(result?.total || 0);
  const afterUsage = currentUsage + tokensToUse;

  if (afterUsage > maxTokensPerMonth) {
    return {
      allowed: false,
      reason: `This request would exceed your monthly token limit (${maxTokensPerMonth.toLocaleString()}) for ${modelName}.`,
      current: currentUsage,
      max: maxTokensPerMonth,
    };
  }

  return {
    allowed: true,
    current: currentUsage,
    max: maxTokensPerMonth,
  };
}

/**
 * ✅ File Upload Limit
 */
export async function checkFileUploadLimit(
  userId: string,
  fileSizeMB: number,
  fileType: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    return {
      allowed: false,
      reason: "No active subscription found",
    };
  }

  const { maxSize, allowedTypes } = plan.limits.files;

  // تحقق من الحجم
  if (fileSizeMB > maxSize) {
    return {
      allowed: false,
      reason: `File size (${fileSizeMB}MB) exceeds limit (${maxSize}MB) for your ${plan.name} plan.`,
      max: maxSize,
    };
  }

  // تحقق من النوع
  if (!allowedTypes.includes("*") && !allowedTypes.includes(fileType)) {
    return {
      allowed: false,
      reason: `File type "${fileType}" is not allowed in your ${plan.name} plan.`,
    };
  }

  return { allowed: true };
}

/**
 * ✅ الحصول على جميع الحدود والاستخدام الحالي
 */
export async function getUserUsageLimits(userId: string) {
  const plan = await getUserPlan(userId);

  if (!plan) {
    return null;
  }

  // جلب الاستخدام الفعلي
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

  const [dailyMessagesResult] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(ChatMessageTable)
    .leftJoin(
      ChatThreadTable,
      eq(ChatMessageTable.threadId, ChatThreadTable.id),
    )
    .where(
      and(
        eq(ChatThreadTable.userId, userId),
        gte(ChatMessageTable.createdAt, today),
        lt(ChatMessageTable.createdAt, tomorrow),
      ),
    );

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

  return {
    plan: {
      id: plan.id,
      name: plan.name,
      slug: plan.slug,
      isBuiltIn: plan.isBuiltIn,
    },
    isActive: plan.isActive,
    limits: {
      agents: {
        current: agentsCount?.count || 0,
        max: plan.limits.features.agents.maxCustomAgents,
        percentage: calculatePercentage(
          agentsCount?.count || 0,
          plan.limits.features.agents.maxCustomAgents,
        ),
      },
      workflows: {
        current: workflowsCount?.count || 0,
        max: plan.limits.features.workflows.maxWorkflows,
        percentage: calculatePercentage(
          workflowsCount?.count || 0,
          plan.limits.features.workflows.maxWorkflows,
        ),
      },
      mcpServers: {
        current: mcpServersCount?.count || 0,
        max: plan.limits.features.mcpServers.maxServers,
        percentage: calculatePercentage(
          mcpServersCount?.count || 0,
          plan.limits.features.mcpServers.maxServers,
        ),
      },
      messagesDaily: {
        current: Number(dailyMessagesResult?.count || 0),
        max: plan.limits.messages.maxPerDay,
        percentage: calculatePercentage(
          Number(dailyMessagesResult?.count || 0),
          plan.limits.messages.maxPerDay,
        ),
      },
      imagesDaily: {
        current: dailyImagesCount?.count || 0,
        max: -1, // Unlimited for now
        percentage: 0,
      },
      models: plan.limits.models,
    },
  };
}

function calculatePercentage(current: number, max: number): number {
  if (max === -1) return 0; // unlimited
  if (max === 0) return 100;
  return Math.min((current / max) * 100, 100);
}
