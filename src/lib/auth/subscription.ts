import "server-only";
import { getSession } from "./auth-instance";
import { getPlanLimits, type SubscriptionPlan } from "../subscription/plans";

export type { SubscriptionPlan } from "../subscription/plans";
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "trial";

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  expiresAt: Date | null;
  isActive: boolean;
}

export async function getUserSubscription(): Promise<SubscriptionInfo | null> {
  try {
    const session = await getSession();
    if (!session?.user?.id) return null;

    // Read directly from database to get latest data
    const { pgDb: db } = await import("@/lib/db/pg/db.pg");
    const { UserTable } = await import("@/lib/db/pg/schema.pg");
    const { eq } = await import("drizzle-orm");

    const [user] = await db
      .select({
        plan: UserTable.plan,
        planStatus: UserTable.planStatus,
        planExpiresAt: UserTable.planExpiresAt,
      })
      .from(UserTable)
      .where(eq(UserTable.id, session.user.id));

    if (!user) return null;

    const plan = (user.plan as SubscriptionPlan) || "free";
    const status = (user.planStatus as SubscriptionStatus) || "active";
    const expiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;

    const isActive = checkSubscriptionActive(status, expiresAt);

    return {
      plan,
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
  const userPlanIndex = planHierarchy.indexOf(subscription.plan);
  const minPlanIndex = planHierarchy.indexOf(minPlan);

  if (userPlanIndex < minPlanIndex) {
    throw new Error(`This feature requires ${minPlan} plan or higher`);
  }
}

export { getPlanLimits };
