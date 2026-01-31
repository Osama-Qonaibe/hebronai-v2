import { eq, sql } from "drizzle-orm";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import {
  PlanTable,
  UserSubscriptionTable,
  SubscriptionHistoryTable,
  type PlanEntity,
  type UserSubscriptionEntity,
} from "@/lib/db/pg/schema.pg";

// Type for creating a new plan
export type NewPlan = typeof PlanTable.$inferInsert;

// Type for updating a plan
export type UpdatePlan = Partial<Omit<NewPlan, "id" | "createdAt">>;

export const plansRepository = {
  // ==================== USER OPERATIONS ====================
  
  // Get all active plans
  async getActivePlans(): Promise<PlanEntity[]> {
    return db.select().from(PlanTable).where(eq(PlanTable.isActive, true));
  },

  // Get all plans (including inactive)
  async getAllPlans(): Promise<PlanEntity[]> {
    return db.select().from(PlanTable);
  },

  // Get plan by slug
  async getPlanBySlug(slug: string): Promise<PlanEntity | undefined> {
    const [plan] = await db
      .select()
      .from(PlanTable)
      .where(eq(PlanTable.slug, slug))
      .limit(1);
    return plan;
  },

  // Get plan by ID
  async getPlanById(id: string): Promise<PlanEntity | undefined> {
    const [plan] = await db
      .select()
      .from(PlanTable)
      .where(eq(PlanTable.id, id))
      .limit(1);
    return plan;
  },

  // Get user's active subscription
  async getUserSubscription(
    userId: string,
  ): Promise<(UserSubscriptionEntity & { plan: PlanEntity }) | undefined> {
    const [subscription] = await db
      .select()
      .from(UserSubscriptionTable)
      .innerJoin(PlanTable, eq(UserSubscriptionTable.planId, PlanTable.id))
      .where(eq(UserSubscriptionTable.userId, userId))
      .limit(1);

    if (!subscription) return undefined;

    return {
      ...subscription.user_subscription,
      plan: subscription.plan,
    };
  },

  // Create subscription
  async createSubscription(
    data: typeof UserSubscriptionTable.$inferInsert,
  ): Promise<UserSubscriptionEntity> {
    const [subscription] = await db
      .insert(UserSubscriptionTable)
      .values(data)
      .returning();

    return subscription;
  },

  // Create or update subscription
  async upsertSubscription(
    data: typeof UserSubscriptionTable.$inferInsert,
  ): Promise<UserSubscriptionEntity> {
    const [subscription] = await db
      .insert(UserSubscriptionTable)
      .values(data)
      .onConflictDoUpdate({
        target: UserSubscriptionTable.userId,
        set: {
          planId: data.planId,
          billingCycle: data.billingCycle,
          status: data.status,
          startDate: data.startDate,
          endDate: data.endDate,
          updatedAt: new Date(),
        },
      })
      .returning();

    return subscription;
  },

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<void> {
    await db
      .update(UserSubscriptionTable)
      .set({
        status: "cancelled",
        cancelledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(UserSubscriptionTable.userId, userId));
  },

  // Update usage statistics
  async updateUsage(
    userId: string,
    updates: Partial<{
      chatsThisMonth: number;
      agentsCreated: number;
      workflowsCreated: number;
      mcpServersAdded: number;
      storageUsedMB: number;
    }>,
  ): Promise<void> {
    const currentUsage = await db
      .select({ currentUsage: UserSubscriptionTable.currentUsage })
      .from(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.userId, userId))
      .limit(1);

    if (!currentUsage[0]) return;

    const existing = currentUsage[0].currentUsage || {
      chatsThisMonth: 0,
      agentsCreated: 0,
      workflowsCreated: 0,
      mcpServersAdded: 0,
      storageUsedMB: 0,
    };

    await db
      .update(UserSubscriptionTable)
      .set({
        currentUsage: {
          chatsThisMonth: updates.chatsThisMonth !== undefined 
            ? updates.chatsThisMonth 
            : existing.chatsThisMonth + (updates.chatsThisMonth || 0),
          agentsCreated: existing.agentsCreated + (updates.agentsCreated || 0),
          workflowsCreated: existing.workflowsCreated + (updates.workflowsCreated || 0),
          mcpServersAdded: existing.mcpServersAdded + (updates.mcpServersAdded || 0),
          storageUsedMB: existing.storageUsedMB + (updates.storageUsedMB || 0),
        },
        updatedAt: new Date(),
      })
      .where(eq(UserSubscriptionTable.userId, userId));
  },

  // Log subscription change
  async logSubscriptionChange(
    userId: string,
    planId: string,
    action: "subscribed" | "upgraded" | "downgraded" | "cancelled" | "renewed" | "expired",
    fromPlanId?: string,
    toPlanId?: string,
  ): Promise<void> {
    await db.insert(SubscriptionHistoryTable).values({
      userId,
      planId,
      action,
      fromPlanId,
      toPlanId,
    });
  },

  // Get subscription history
  async getSubscriptionHistory(userId: string) {
    return db
      .select()
      .from(SubscriptionHistoryTable)
      .where(eq(SubscriptionHistoryTable.userId, userId))
      .orderBy(SubscriptionHistoryTable.createdAt);
  },

  // ==================== ADMIN OPERATIONS ====================

  /**
   * Create a new plan (Admin only)
   */
  async createPlan(data: NewPlan): Promise<PlanEntity> {
    const [plan] = await db
      .insert(PlanTable)
      .values({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return plan;
  },

  /**
   * Update an existing plan (Admin only)
   */
  async updatePlan(id: string, data: UpdatePlan): Promise<PlanEntity | undefined> {
    const [plan] = await db
      .update(PlanTable)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(PlanTable.id, id))
      .returning();

    return plan;
  },

  /**
   * Delete a plan (Admin only)
   * Note: This will fail if there are active subscriptions using this plan
   */
  async deletePlan(id: string): Promise<boolean> {
    const result = await db
      .delete(PlanTable)
      .where(eq(PlanTable.id, id));

    return result.rowCount ? result.rowCount > 0 : false;
  },

  /**
   * Toggle plan active status (Admin only)
   */
  async togglePlanActive(id: string, isActive: boolean): Promise<PlanEntity | undefined> {
    const [plan] = await db
      .update(PlanTable)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(PlanTable.id, id))
      .returning();

    return plan;
  },

  /**
   * Get all subscriptions for a specific plan (Admin only)
   */
  async getPlanSubscriptions(planId: string): Promise<UserSubscriptionEntity[]> {
    return db
      .select()
      .from(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.planId, planId));
  },

  /**
   * Check if plan can be deleted (has no active subscriptions)
   */
  async canDeletePlan(planId: string): Promise<boolean> {
    const subscriptions = await db
      .select()
      .from(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.planId, planId))
      .limit(1);

    return subscriptions.length === 0;
  },
};

// Named exports for backward compatibility
export const getAllPlans = plansRepository.getAllPlans.bind(plansRepository);
export const getPlanBySlug = plansRepository.getPlanBySlug.bind(plansRepository);
export const getUserSubscription = plansRepository.getUserSubscription.bind(plansRepository);
export const createSubscription = plansRepository.createSubscription.bind(plansRepository);
export const cancelSubscription = plansRepository.cancelSubscription.bind(plansRepository);
export const updateUsage = plansRepository.updateUsage.bind(plansRepository);

// New admin exports
export const createPlan = plansRepository.createPlan.bind(plansRepository);
export const updatePlan = plansRepository.updatePlan.bind(plansRepository);
export const deletePlan = plansRepository.deletePlan.bind(plansRepository);
export const togglePlanActive = plansRepository.togglePlanActive.bind(plansRepository);
