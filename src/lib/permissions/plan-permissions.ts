import { getUserSubscription } from "../db/pg/repositories/plans.repository";

export type ResourceType = "chats" | "agents" | "workflows" | "mcpServers";

export async function canCreateResource(
  userId: string,
  resource: ResourceType
): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return { allowed: false, reason: "No active subscription" };
  }

  const { plan } = subscription;
  const usage = subscription.subscription.currentUsage || {
    chatsThisMonth: 0,
    agentsCreated: 0,
    workflowsCreated: 0,
    mcpServersAdded: 0,
    storageUsedMB: 0,
  };

  const limits: Record<ResourceType, number | "unlimited"> = {
    chats: plan.features.maxChatsPerMonth,
    agents: plan.features.maxAgents,
    workflows: plan.features.maxWorkflows,
    mcpServers: plan.features.maxMcpServers,
  };

  const currentUsage: Record<ResourceType, number> = {
    chats: usage.chatsThisMonth,
    agents: usage.agentsCreated,
    workflows: usage.workflowsCreated,
    mcpServers: usage.mcpServersAdded,
  };

  const limit = limits[resource];

  if (limit === "unlimited") {
    return { allowed: true };
  }

  if (currentUsage[resource] >= limit) {
    return {
      allowed: false,
      reason: `You have reached your ${resource} limit (${limit}). Please upgrade your plan.`,
    };
  }

  return { allowed: true };
}

export async function hasFeature(
  userId: string,
  feature:
    | "customBranding"
    | "prioritySupport"
    | "apiAccess"
    | "webhooks"
    | "advancedAnalytics"
    | "customDomain"
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return false;
  }

  return subscription.plan.features[feature] === true;
}

export async function getRemainingQuota(
  userId: string,
  resource: ResourceType
): Promise<{ remaining: number | "unlimited"; total: number | "unlimited" }> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return { remaining: 0, total: 0 };
  }

  const { plan } = subscription;
  const usage = subscription.subscription.currentUsage || {
    chatsThisMonth: 0,
    agentsCreated: 0,
    workflowsCreated: 0,
    mcpServersAdded: 0,
    storageUsedMB: 0,
  };

  const limits: Record<ResourceType, number | "unlimited"> = {
    chats: plan.features.maxChatsPerMonth,
    agents: plan.features.maxAgents,
    workflows: plan.features.maxWorkflows,
    mcpServers: plan.features.maxMcpServers,
  };

  const currentUsage: Record<ResourceType, number> = {
    chats: usage.chatsThisMonth,
    agents: usage.agentsCreated,
    workflows: usage.workflowsCreated,
    mcpServers: usage.mcpServersAdded,
  };

  const limit = limits[resource];

  if (limit === "unlimited") {
    return { remaining: "unlimited", total: "unlimited" };
  }

  return {
    remaining: Math.max(0, limit - currentUsage[resource]),
    total: limit,
  };
}

export async function getCurrentPlan(userId: string) {
  const subscription = await getUserSubscription(userId);
  return subscription?.plan || null;
}

export async function getUsageStats(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return null;
  }

  return subscription.subscription.currentUsage;
}