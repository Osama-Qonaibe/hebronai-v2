import "server-only";
import { getSession } from "./auth-instance";
import { getPlanLimits, type SubscriptionPlan } from "../subscription/plans";
import { pgDb as db } from "../db/pg/db.pg";
import { UserTable, SubscriptionPlanTable } from "../db/pg/schema.pg";
import { eq } from "drizzle-orm";

export type { SubscriptionPlan } from "../subscription/plans";
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "trial";

export interface SubscriptionInfo {
  plan: string;
  status: SubscriptionStatus;
  expiresAt: Date | null;
  isActive: boolean;
}

export async function getUserSubscription(): Promise<SubscriptionInfo | null> {
  try {
    const session = await getSession();
    if (!session?.user?.id) return null;

    const [user] = await db
      .select({
        plan: UserTable.plan,
        planId: UserTable.planId,
        planStatus: UserTable.planStatus,
        planExpiresAt: UserTable.planExpiresAt,
      })
      .from(UserTable)
      .where(eq(UserTable.id, session.user.id));

    if (!user) return null;

    let planSlug: string = "free";

    if (user.planId) {
      const [customPlan] = await db
        .select({ slug: SubscriptionPlanTable.slug })
        .from(SubscriptionPlanTable)
        .where(eq(SubscriptionPlanTable.id, user.planId))
        .limit(1);
      
      if (customPlan) {
        planSlug = customPlan.slug;
      }
    } else if (user.plan) {
      planSlug = user.plan;
    }

    const status = (user.planStatus as SubscriptionStatus) || "active";
    const expiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;

    const isActive = checkSubscriptionActive(status, expiresAt);

    return {
      plan: planSlug,
      status,
      expiresAt,
      isActive,
    };
  } catch (error) {
    console.error("Error getting subscription:", error);
    return null;
  }
}

export function checkSubscriptionActive(
  status: SubscriptionStatus,
  expiresAt: Date | null,
): boolean {
  if (status === "cancelled" || status === "expired") return false;
  if (expiresAt && expiresAt < new Date()) return false;
  return true;
}

export async function requireActiveSubscription(
  minPlan: SubscriptionPlan = "free",
): Promise<void> {
  const subscription = await getUserSubscription();

  if (!subscription) {
    throw new Error("No subscription found");
  }

  if (!subscription.isActive) {
    throw new Error("Subscription is not active");
  }

  const planHierarchy: SubscriptionPlan[] = [
    "free",
    "basic",
    "pro",
    "enterprise",
  ];
  const userPlanIndex = planHierarchy.indexOf(subscription.plan as SubscriptionPlan);
  const minPlanIndex = planHierarchy.indexOf(minPlan);

  if (userPlanIndex < minPlanIndex) {
    throw new Error(`This feature requires ${minPlan} plan or higher`);
  }
}

export { getPlanLimits };
