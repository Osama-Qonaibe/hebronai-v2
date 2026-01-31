import { eq, and, desc } from "drizzle-orm";
import { db } from "../db.pg";
import {
  PlanTable,
  UserSubscriptionTable,
  SubscriptionHistoryTable,
} from "../schema.pg";

export async function getAllPlans() {
  return await db
    .select()
    .from(PlanTable)
    .where(and(eq(PlanTable.isActive, true), eq(PlanTable.isPublic, true)))
    .orderBy(PlanTable.sortOrder);
}

export async function getPlanBySlug(slug: string) {
  const result = await db
    .select()
    .from(PlanTable)
    .where(eq(PlanTable.slug, slug))
    .limit(1);
  return result[0] || null;
}

export async function getPlanById(planId: string) {
  const result = await db
    .select()
    .from(PlanTable)
    .where(eq(PlanTable.id, planId))
    .limit(1);
  return result[0] || null;
}

export async function getUserSubscription(userId: string) {
  const result = await db
    .select({
      subscription: UserSubscriptionTable,
      plan: PlanTable,
    })
    .from(UserSubscriptionTable)
    .innerJoin(PlanTable, eq(UserSubscriptionTable.planId, PlanTable.id))
    .where(
      and(
        eq(UserSubscriptionTable.userId, userId),
        eq(UserSubscriptionTable.status, "active")
      )
    )
    .limit(1);
  return result[0] || null;
}

export async function createSubscription(data: {
  userId: string;
  planId: string;
  billingCycle: "monthly" | "yearly" | "lifetime";
  paymentProvider?: string;
  subscriptionId?: string;
  customerId?: string;
}) {
  const [subscription] = await db
    .insert(UserSubscriptionTable)
    .values({
      userId: data.userId,
      planId: data.planId,
      billingCycle: data.billingCycle,
      status: "active",
      paymentProvider: data.paymentProvider,
      subscriptionId: data.subscriptionId,
      customerId: data.customerId,
    })
    .returning();

  await db.insert(SubscriptionHistoryTable).values({
    userId: data.userId,
    planId: data.planId,
    action: "subscribed",
    toPlanId: data.planId,
  });

  return subscription;
}

export async function updateSubscription(
  subscriptionId: string,
  data: Partial<{
    status: "active" | "cancelled" | "expired" | "suspended";
    endDate: Date;
    cancelledAt: Date;
  }>
) {
  const [updated] = await db
    .update(UserSubscriptionTable)
    .set(data)
    .where(eq(UserSubscriptionTable.id, subscriptionId))
    .returning();
  return updated;
}

export async function cancelSubscription(subscriptionId: string) {
  return await updateSubscription(subscriptionId, {
    status: "cancelled",
    cancelledAt: new Date(),
  });
}

export async function updateUsage(
  userId: string,
  updates: Partial<{
    chatsThisMonth: number;
    agentsCreated: number;
    workflowsCreated: number;
    mcpServersAdded: number;
    storageUsedMB: number;
  }>
) {
  const subscription = await getUserSubscription(userId);
  if (!subscription) return null;

  const currentUsage = subscription.subscription.currentUsage || {
    chatsThisMonth: 0,
    agentsCreated: 0,
    workflowsCreated: 0,
    mcpServersAdded: 0,
    storageUsedMB: 0,
  };

  const newUsage = { ...currentUsage, ...updates };

  const [updated] = await db
    .update(UserSubscriptionTable)
    .set({ currentUsage: newUsage })
    .where(eq(UserSubscriptionTable.id, subscription.subscription.id))
    .returning();

  return updated;
}

export async function getSubscriptionHistory(userId: string) {
  return await db
    .select({
      history: SubscriptionHistoryTable,
      plan: PlanTable,
    })
    .from(SubscriptionHistoryTable)
    .innerJoin(PlanTable, eq(SubscriptionHistoryTable.planId, PlanTable.id))
    .where(eq(SubscriptionHistoryTable.userId, userId))
    .orderBy(desc(SubscriptionHistoryTable.createdAt));
}