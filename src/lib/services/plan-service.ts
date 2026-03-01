import { db } from '../db/pg';
import { plans as plansTable, users as usersTable } from '../db/pg/schema';
import type { PlanWithLimits } from '../db/pg/schema';
import { eq, and, or, isNull } from 'drizzle-orm';

export async function getUserPlan(userId: string): Promise<PlanWithLimits> {
  const user = await db.query.users.findFirst({
    where: eq(usersTable.id, userId),
    with: {
      customPlan: true,
    },
  });

  if (!user) {
    return getBuiltInPlan('free');
  }

  if (user.planId) {
    return user.customPlan!;
  }

  if (user.plan) {
    return getBuiltInPlan(user.plan);
  }

  return getBuiltInPlan('free');
}

export async function getBuiltInPlan(slug: string): Promise<PlanWithLimits> {
  const plan = await db.query.plans.findFirst({
    where: and(eq(plansTable.slug, slug), eq(plansTable.isBuiltIn, true)),
  });

  if (!plan) {
    const freePlan = await db.query.plans.findFirst({
      where: and(
        eq(plansTable.slug, 'free'),
        eq(plansTable.isBuiltIn, true)
      ),
    });

    if (!freePlan) {
      throw new Error('Free plan not found in database');
    }

    return freePlan;
  }

  return plan;
}

export async function getCustomPlan(planId: string): Promise<PlanWithLimits | null> {
  const plan = await db.query.plans.findFirst({
    where: eq(plansTable.id, planId),
  });

  return plan || null;
}

/**
 * Get all active plans (both built-in and custom) for display
 * Filters out inactive plans and sorts by price
 */
export async function getActivePlans(): Promise<PlanWithLimits[]> {
  const activePlans = await db.query.plans.findMany({
    where: or(
      eq(plansTable.isActive, true),
      isNull(plansTable.isActive)
    ),
    orderBy: (plans, { asc }) => [asc(plans.price)],
  });

  return activePlans;
}

/**
 * Get only built-in plans (free, basic, pro, enterprise)
 */
export async function getBuiltInPlans(): Promise<PlanWithLimits[]> {
  const builtInPlans = await db.query.plans.findMany({
    where: and(
      eq(plansTable.isBuiltIn, true),
      or(
        eq(plansTable.isActive, true),
        isNull(plansTable.isActive)
      )
    ),
    orderBy: (plans, { asc }) => [asc(plans.price)],
  });

  return builtInPlans;
}

/**
 * Get only custom plans (created by admin)
 */
export async function getCustomPlans(): Promise<PlanWithLimits[]> {
  const customPlans = await db.query.plans.findMany({
    where: and(
      eq(plansTable.isBuiltIn, false),
      or(
        eq(plansTable.isActive, true),
        isNull(plansTable.isActive)
      )
    ),
    orderBy: (plans, { asc }) => [asc(plans.price)],
  });

  return customPlans;
}
