import { eq } from "drizzle-orm";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import {
  PlanTable,
  UserSubscriptionTable,
  SubscriptionHistoryTable,
  type Plan,
  type UserSubscription,
  type NewUserSubscription,
} from "@/lib/db/pg/schema.pg";

export const plansRepository = {
  // Get all active plans
  async getActivePlans(): Promise<Plan[]> {
    return db.select().from(PlanTable).where(eq(PlanTable.isActive, true));
  },

  // Get plan by slug
  async getPlanBySlug(slug: string): Promise<Plan | undefined> {
    const [plan] = await db
      .select()
      .from(PlanTable)
      .where(eq(PlanTable.slug, slug))
      .limit(1);
    return plan;
  },

  // Get plan by ID
  async getPlanById(id: number): Promise<Plan | undefined> {
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
  ): Promise<(UserSubscription & { plan: Plan }) | undefined> {
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

  // Create or update subscription
  async upsertSubscription(
    data: NewUserSubscription,
  ): Promise<UserSubscription> {
    const [subscription] = await db
      .insert(UserSubscriptionTable)
      .values(data)
      .onConflictDoUpdate({
        target: UserSubscriptionTable.userId,
        set: {
          planId: data.planId,
          billingCycle: data.billingCycle,
          status: data.status,
          currentPeriodStart: data.currentPeriodStart,
          currentPeriodEnd: data.currentPeriodEnd,
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

  // Log subscription change
  async logSubscriptionChange(
    userId: string,
    oldPlanId: number | null,
    newPlanId: number,
    action: "subscribed" | "upgraded" | "downgraded" | "cancelled",
  ): Promise<void> {
    await db.insert(SubscriptionHistoryTable).values({
      userId,
      oldPlanId,
      newPlanId,
      action,
    });
  },

  // Get subscription history
  async getSubscriptionHistory(userId: string) {
    return db
      .select()
      .from(SubscriptionHistoryTable)
      .where(eq(SubscriptionHistoryTable.userId, userId))
      .orderBy(SubscriptionHistoryTable.changedAt);
  },
};
