import { updateUsage } from "../db/pg/repositories/plans.repository";
import { ResourceType } from "../permissions/plan-permissions";

export async function trackResourceCreation(
  userId: string,
  resource: ResourceType
) {
  const updates: Record<ResourceType, Partial<{
    chatsThisMonth: number;
    agentsCreated: number;
    workflowsCreated: number;
    mcpServersAdded: number;
  }>> = {
    chats: { chatsThisMonth: 1 },
    agents: { agentsCreated: 1 },
    workflows: { workflowsCreated: 1 },
    mcpServers: { mcpServersAdded: 1 },
  };

  await updateUsage(userId, updates[resource]);
}

export async function incrementChatCount(userId: string) {
  await trackResourceCreation(userId, "chats");
}

export async function incrementAgentCount(userId: string) {
  await trackResourceCreation(userId, "agents");
}

export async function incrementWorkflowCount(userId: string) {
  await trackResourceCreation(userId, "workflows");
}

export async function incrementMcpServerCount(userId: string) {
  await trackResourceCreation(userId, "mcpServers");
}

export async function resetMonthlyUsage(userId: string) {
  await updateUsage(userId, {
    chatsThisMonth: 0,
  });
}