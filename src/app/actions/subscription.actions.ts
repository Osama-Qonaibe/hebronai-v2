"use server";

import { auth } from "auth/server";
import {
  getAllPlans,
  getPlanBySlug,
  getUserSubscription,
  createSubscription,
  cancelSubscription,
  plansRepository,
} from "@/lib/db/pg/repositories/plans.repository";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import { SubscriptionHistoryTable } from "@/lib/db/pg/schema.pg";
import { revalidatePath } from "next/cache";

export async function getPlans() {
  try {
    const plans = await getAllPlans();
    return { success: true, data: plans };
  } catch (error) {
    return { success: false, error: "Failed to fetch plans" };
  }
}

export async function getMySubscription() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const subscription = await getUserSubscription(session.user.id);
    return { success: true, data: subscription };
  } catch (error) {
    return { success: false, error: "Failed to fetch subscription" };
  }
}

export async function subscribeToPlan(data: {
  planSlug: string;
  billingCycle: "monthly" | "yearly" | "lifetime";
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const existingSubscription = await getUserSubscription(session.user.id);
    if (existingSubscription) {
      return { success: false, error: "You already have an active subscription" };
    }

    const plan = await getPlanBySlug(data.planSlug);
    if (!plan) {
      return { success: false, error: "Plan not found" };
    }

    const subscription = await createSubscription({
      userId: session.user.id,
      planId: plan.id,
      billingCycle: data.billingCycle,
      status: "active",
    });

    // Log subscription history
    await plansRepository.logSubscriptionChange(
      session.user.id,
      plan.id,
      "subscribed",
      undefined,
      plan.id
    );

    revalidatePath("/subscription");
    revalidatePath("/usage");

    return { success: true, data: subscription };
  } catch (error) {
    return { success: false, error: "Failed to create subscription" };
  }
}

export async function upgradePlan(newPlanSlug: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const currentSubscription = await getUserSubscription(session.user.id);
    if (!currentSubscription) {
      return { success: false, error: "No active subscription found" };
    }

    const newPlan = await getPlanBySlug(newPlanSlug);
    if (!newPlan) {
      return { success: false, error: "Plan not found" };
    }

    // Cancel using userId
    await cancelSubscription(session.user.id);

    const newSubscription = await createSubscription({
      userId: session.user.id,
      planId: newPlan.id,
      billingCycle: currentSubscription.billingCycle,
      status: "active",
    });

    // Log subscription history
    await plansRepository.logSubscriptionChange(
      session.user.id,
      newPlan.id,
      "upgraded",
      currentSubscription.plan.id,
      newPlan.id
    );

    revalidatePath("/subscription");
    revalidatePath("/usage");

    return { success: true, data: newSubscription };
  } catch (error) {
    return { success: false, error: "Failed to upgrade plan" };
  }
}

export async function downgradePlan(newPlanSlug: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const currentSubscription = await getUserSubscription(session.user.id);
    if (!currentSubscription) {
      return { success: false, error: "No active subscription found" };
    }

    const newPlan = await getPlanBySlug(newPlanSlug);
    if (!newPlan) {
      return { success: false, error: "Plan not found" };
    }

    // Cancel using userId
    await cancelSubscription(session.user.id);

    const newSubscription = await createSubscription({
      userId: session.user.id,
      planId: newPlan.id,
      billingCycle: currentSubscription.billingCycle,
      status: "active",
    });

    // Log subscription history
    await plansRepository.logSubscriptionChange(
      session.user.id,
      newPlan.id,
      "downgraded",
      currentSubscription.plan.id,
      newPlan.id
    );

    revalidatePath("/subscription");
    revalidatePath("/usage");

    return { success: true, data: newSubscription };
  } catch (error) {
    return { success: false, error: "Failed to downgrade plan" };
  }
}

export async function cancelMySubscription() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const subscription = await getUserSubscription(session.user.id);
    if (!subscription) {
      return { success: false, error: "No active subscription found" };
    }

    // Cancel using userId
    await cancelSubscription(session.user.id);

    // Log subscription history
    await plansRepository.logSubscriptionChange(
      session.user.id,
      subscription.plan.id,
      "cancelled",
      subscription.plan.id,
      undefined
    );

    revalidatePath("/subscription");
    revalidatePath("/usage");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to cancel subscription" };
  }
}
