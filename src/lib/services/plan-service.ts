import { db } from '@/lib/db/pg';
import {
  SubscriptionPlanTable as plans,
  UserTable as users,
  type SubscriptionPlanEntity,
} from '@/lib/db/pg';
import { eq, and, or } from 'drizzle-orm';

export type PlanWithLimits = SubscriptionPlanEntity;

export async function getUserPlan(userId: string): Promise<PlanWithLimits> {
  const user = await db.query.UserTable.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    return getBuiltInPlan('free');
  }

  // ✅ Priority 1: Custom plan (planId)
  if (user.planId) {
    const customPlan = await getCustomPlan(user.planId);
    if (customPlan) return customPlan;
  }

  // ✅ Priority 2: Built-in plan (plan field)
  if (user.plan) {
    return getBuiltInPlan(user.plan);
  }

  // ✅ Fallback: Free plan
  return getBuiltInPlan('free');
}

export async function getBuiltInPlan(slug: string): Promise<PlanWithLimits> {
  const plan = await db.query.SubscriptionPlanTable.findFirst({
    where: and(eq(plans.slug, slug), eq(plans.isBuiltIn, true)),
  });

  if (!plan) {
    // Fallback to free plan
    const freePlan = await db.query.SubscriptionPlanTable.findFirst({
      where: and(eq(plans.slug, 'free'), eq(plans.isBuiltIn, true)),
    });

    if (!freePlan) {
      throw new Error('Free plan not found in database');
    }

    return freePlan;
  }

  return plan;
}

export async function getCustomPlan(
  planId: string,
): Promise<PlanWithLimits | null> {
  const plan = await db.query.SubscriptionPlanTable.findFirst({
    where: eq(plans.id, planId),
  });

  return plan || null;
}

export async function getActivePlans(): Promise<PlanWithLimits[]> {
  // Get all plans (built-in or custom)
  const activePlans = await db
    .select()
    .from(plans)
    .where(
      or(
        eq(plans.isBuiltIn, true),
        // Custom plans are included too
      ),
    );

  // Filter by adminSettings.isActive
  return activePlans.filter(
    (plan: any) =>
      plan.adminSettings?.isActive === true ||
      plan.adminSettings?.isActive == null,
  );
}

export async function getBuiltInPlans(): Promise<PlanWithLimits[]> {
  const builtInPlans = await db
    .select()
    .from(plans)
    .where(eq(plans.isBuiltIn, true));

  return builtInPlans.filter(
    (plan: any) =>
      plan.adminSettings?.isActive === true ||
      plan.adminSettings?.isActive == null,
  );
}

export async function getCustomPlans(): Promise<PlanWithLimits[]> {
  const customPlans = await db
    .select()
    .from(plans)
    .where(eq(plans.isBuiltIn, false));

  return customPlans.filter(
    (plan: any) =>
      plan.adminSettings?.isActive === true ||
      plan.adminSettings?.isActive == null,
  );
}
