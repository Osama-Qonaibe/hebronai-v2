import "server-only";
import { getUserPlan, isUnlimited } from "../subscription/plan-service";
import { PLAN_LIMITS } from "../subscription/plans";
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
import {
  createNoSubscriptionError,
  createAgentLimitError,
  createWorkflowLimitError,
  createMCPServerLimitError,
  createDailyMessageLimitError,
  createDailyImageLimitError,
  createMonthlyImageLimitError,
  createMonthlyTokenLimitError,
  createStorageLimitError,
  createAPICallLimitError,
  createDocumentLimitError,
  createFeatureNotAvailableError,
} from "lib/usage/limit-errors";

export interface LimitCheckResult {
  allowed: boolean;
  reason?: string;
  current?: number;
  max?: number;
}

export async function checkAgentCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
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
    throw createAgentLimitError(currentCount, maxAgents);
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxAgents,
  };
}

export async function checkWorkflowCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
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
    throw createWorkflowLimitError(currentCount, maxWorkflows);
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxWorkflows,
  };
}

export async function checkMCPServerCreationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
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
    throw createMCPServerLimitError(currentCount, maxServers);
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxServers,
  };
}

export async function checkDailyMessageLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
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
        eq(ChatMessageTable.role, "user"),
        gte(ChatMessageTable.createdAt, today),
        lt(ChatMessageTable.createdAt, tomorrow),
      ),
    );

  const currentCount = Number(result?.count || 0);

  if (currentCount >= maxPerDay) {
    throw createDailyMessageLimitError(currentCount, maxPerDay);
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxPerDay,
  };
}

export async function checkImageGenerationLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
  }

  const planLimits = PLAN_LIMITS[plan.slug as keyof typeof PLAN_LIMITS];
  if (!planLimits) {
    throw new Error(`Unknown plan: ${plan.slug}`);
  }

  const maxPerDay = planLimits.maxImagesPerDay || 0;

  if (maxPerDay === 0) {
    throw createFeatureNotAvailableError("Image generation", plan.name);
  }

  if (isUnlimited(maxPerDay)) {
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

  if (currentCount >= maxPerDay) {
    throw createDailyImageLimitError(currentCount, maxPerDay);
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxPerDay,
  };
}

export async function checkImageGenerationMonthlyLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
  }

  const planLimits = PLAN_LIMITS[plan.slug as keyof typeof PLAN_LIMITS];
  if (!planLimits) {
    throw new Error(`Unknown plan: ${plan.slug}`);
  }

  const maxPerMonth = planLimits.maxImagesPerMonth || 0;

  if (maxPerMonth === 0) {
    throw createFeatureNotAvailableError("Image generation", plan.name);
  }

  if (isUnlimited(maxPerMonth)) {
    return { allowed: true };
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const [result] = await db
    .select({ count: count() })
    .from(ImageGenerationTable)
    .where(
      and(
        eq(ImageGenerationTable.userId, userId),
        gte(ImageGenerationTable.createdAt, startOfMonth),
        lt(ImageGenerationTable.createdAt, endOfMonth),
        eq(ImageGenerationTable.status, "completed"),
      ),
    );

  const currentCount = result?.count || 0;

  if (currentCount >= maxPerMonth) {
    throw createMonthlyImageLimitError(currentCount, maxPerMonth);
  }

  return {
    allowed: true,
    current: currentCount,
    max: maxPerMonth,
  };
}

export async function checkTotalTokenLimit(
  userId: string,
  tokensToUse: number,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || (plan.isActive !== undefined && !plan.isActive)) {
    throw createNoSubscriptionError();
  }

  const planLimits = PLAN_LIMITS[plan.slug as keyof typeof PLAN_LIMITS];
  if (!planLimits) {
    throw new Error(`Unknown plan: ${plan.slug}`);
  }

  const maxTokensPerMonth = planLimits.maxTokensPerMonth;

  if (isUnlimited(maxTokensPerMonth)) {
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
        lt(UsageTable.periodStart, endOfMonth),
      ),
    );

  const currentUsage = Number(result?.total || 0);
  const afterUsage = currentUsage + tokensToUse;

  if (afterUsage > maxTokensPerMonth) {
    throw createMonthlyTokenLimitError(currentUsage, maxTokensPerMonth);
  }

  return {
    allowed: true,
    current: currentUsage,
    max: maxTokensPerMonth,
  };
}

export async function checkStorageLimit(
  userId: string,
  fileSizeMB: number,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || (plan.isActive !== undefined && !plan.isActive)) {
    throw createNoSubscriptionError();
  }

  const planLimits = PLAN_LIMITS[plan.slug as keyof typeof PLAN_LIMITS];
  if (!planLimits) {
    throw new Error(`Unknown plan: ${plan.slug}`);
  }

  const maxStorageGB = planLimits.maxStorageGB;

  if (isUnlimited(maxStorageGB)) {
    return { allowed: true };
  }

  const [result] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "storage"),
      ),
    );

  const currentUsageMB = Number(result?.total || 0);
  const currentUsageGB = currentUsageMB / 1024;
  const afterUsageGB = (currentUsageMB + fileSizeMB) / 1024;

  if (afterUsageGB > maxStorageGB) {
    throw createStorageLimitError(currentUsageGB, maxStorageGB);
  }

  return {
    allowed: true,
    current: Math.round(currentUsageGB * 100) / 100,
    max: maxStorageGB,
  };
}

export async function checkAPICallLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || (plan.isActive !== undefined && !plan.isActive)) {
    throw createNoSubscriptionError();
  }

  const planLimits = PLAN_LIMITS[plan.slug as keyof typeof PLAN_LIMITS];
  if (!planLimits) {
    throw new Error(`Unknown plan: ${plan.slug}`);
  }

  const maxCallsPerDay = planLimits.maxAPICallsPerDay;

  if (isUnlimited(maxCallsPerDay)) {
    return { allowed: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [result] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "api_calls"),
        gte(UsageTable.periodStart, today),
        lt(UsageTable.periodStart, tomorrow),
      ),
    );

  const currentCalls = Number(result?.total || 0);

  if (currentCalls >= maxCallsPerDay) {
    throw createAPICallLimitError(currentCalls, maxCallsPerDay);
  }

  return {
    allowed: true,
    current: currentCalls,
    max: maxCallsPerDay,
  };
}

export async function checkDocumentLimit(
  userId: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || (plan.isActive !== undefined && !plan.isActive)) {
    throw createNoSubscriptionError();
  }

  const planLimits = PLAN_LIMITS[plan.slug as keyof typeof PLAN_LIMITS];
  if (!planLimits) {
    throw new Error(`Unknown plan: ${plan.slug}`);
  }

  const maxDocsPerMonth = planLimits.maxDocumentsPerMonth;

  if (isUnlimited(maxDocsPerMonth)) {
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
        eq(UsageTable.resourceType, "documents"),
        gte(UsageTable.periodStart, startOfMonth),
        lt(UsageTable.periodStart, endOfMonth),
      ),
    );

  const currentDocs = Number(result?.total || 0);

  if (currentDocs >= maxDocsPerMonth) {
    throw createDocumentLimitError(currentDocs, maxDocsPerMonth);
  }

  return {
    allowed: true,
    current: currentDocs,
    max: maxDocsPerMonth,
  };
}

export async function checkTokenLimit(
  userId: string,
  modelName: string,
  tokensToUse: number,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
  }

  if (!plan.limits.models.allowed.includes(modelName)) {
    throw createFeatureNotAvailableError(`Model ${modelName}`, plan.name);
  }

  const modelLimits = plan.limits.models.limits[modelName];
  if (!modelLimits) {
    throw new Error(`No limits defined for model "${modelName}".`);
  }

  const maxTokensPerMonth = modelLimits.maxTokensPerMonth;

  if (isUnlimited(maxTokensPerMonth)) {
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
        sql`${UsageTable.metadata}->>'model' = ${modelName}`,
        gte(UsageTable.periodStart, startOfMonth),
        lt(UsageTable.periodStart, endOfMonth),
      ),
    );

  const currentUsage = Number(result?.total || 0);
  const afterUsage = currentUsage + tokensToUse;

  if (afterUsage > maxTokensPerMonth) {
    throw createMonthlyTokenLimitError(currentUsage, maxTokensPerMonth);
  }

  return {
    allowed: true,
    current: currentUsage,
    max: maxTokensPerMonth,
  };
}

export async function checkFileUploadLimit(
  userId: string,
  fileSizeMB: number,
  fileType: string,
): Promise<LimitCheckResult> {
  const plan = await getUserPlan(userId);

  if (!plan || !plan.isActive) {
    throw createNoSubscriptionError();
  }

  const { maxSize, allowedTypes } = plan.limits.files;

  if (fileSizeMB > maxSize) {
    throw new Error(
      `File size (${fileSizeMB}MB) exceeds limit (${maxSize}MB) for your ${plan.name} plan.`,
    );
  }

  if (!allowedTypes.includes("*") && !allowedTypes.includes(fileType)) {
    throw new Error(
      `File type "${fileType}" is not allowed in your ${plan.name} plan.`,
    );
  }

  return { allowed: true };
}

export async function getUserUsageLimits(userId: string) {
  const plan = await getUserPlan(userId);

  if (!plan) {
    return null;
  }

  const planLimits = PLAN_LIMITS[plan.slug as keyof typeof PLAN_LIMITS];

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
        eq(ChatMessageTable.role, "user"),
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

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const [monthlyImagesCount] = await db
    .select({ count: count() })
    .from(ImageGenerationTable)
    .where(
      and(
        eq(ImageGenerationTable.userId, userId),
        gte(ImageGenerationTable.createdAt, startOfMonth),
        lt(ImageGenerationTable.createdAt, endOfMonth),
        eq(ImageGenerationTable.status, "completed"),
      ),
    );

  const [monthlyTokensResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "tokens"),
        gte(UsageTable.periodStart, startOfMonth),
        lt(UsageTable.periodStart, endOfMonth),
      ),
    );

  const [storageResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "storage"),
      ),
    );

  const [dailyAPICallsResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "api_calls"),
        gte(UsageTable.periodStart, today),
        lt(UsageTable.periodStart, tomorrow),
      ),
    );

  const [monthlyDocumentsResult] = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${UsageTable.amount} AS NUMERIC)), 0)`,
    })
    .from(UsageTable)
    .where(
      and(
        eq(UsageTable.userId, userId),
        eq(UsageTable.resourceType, "documents"),
        gte(UsageTable.periodStart, startOfMonth),
        lt(UsageTable.periodStart, endOfMonth),
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
        max: planLimits?.maxImagesPerDay || 0,
        percentage: calculatePercentage(
          dailyImagesCount?.count || 0,
          planLimits?.maxImagesPerDay || 0,
        ),
      },
      imagesMonthly: {
        current: monthlyImagesCount?.count || 0,
        max: planLimits?.maxImagesPerMonth || 0,
        percentage: calculatePercentage(
          monthlyImagesCount?.count || 0,
          planLimits?.maxImagesPerMonth || 0,
        ),
      },
      tokensMonthly: {
        current: Number(monthlyTokensResult?.total || 0),
        max: planLimits?.maxTokensPerMonth || 0,
        percentage: calculatePercentage(
          Number(monthlyTokensResult?.total || 0),
          planLimits?.maxTokensPerMonth || 0,
        ),
      },
      storage: {
        current:
          Math.round((Number(storageResult?.total || 0) / 1024) * 100) / 100,
        max: planLimits?.maxStorageGB || 0,
        percentage: calculatePercentage(
          Number(storageResult?.total || 0) / 1024,
          planLimits?.maxStorageGB || 0,
        ),
      },
      apiCallsDaily: {
        current: Number(dailyAPICallsResult?.total || 0),
        max: planLimits?.maxAPICallsPerDay || 0,
        percentage: calculatePercentage(
          Number(dailyAPICallsResult?.total || 0),
          planLimits?.maxAPICallsPerDay || 0,
        ),
      },
      documentsMonthly: {
        current: Number(monthlyDocumentsResult?.total || 0),
        max: planLimits?.maxDocumentsPerMonth || 0,
        percentage: calculatePercentage(
          Number(monthlyDocumentsResult?.total || 0),
          planLimits?.maxDocumentsPerMonth || 0,
        ),
      },
      models: plan.limits.models,
    },
  };
}

function calculatePercentage(current: number, max: number): number {
  if (max === -1) return 0;
  if (max === 0) return 100;
  return Math.min((current / max) * 100, 100);
}
