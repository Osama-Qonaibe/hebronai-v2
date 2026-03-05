import { pgDb } from "@/lib/db/pg/db.pg";
import { UserTable, SubscriptionPlanTable, ImageGenerationTable, DailyUsageSummaryTable } from "@/lib/db/pg/schema.pg";
import { eq, and, gte, sql } from "drizzle-orm";
import { PLAN_LIMITS } from "./plans";
import type { SubscriptionPlan } from "./plans";

export interface ImageLimitCheck {
  allowed: boolean;
  reason?: string;
  dailyUsed: number;
  dailyLimit: number;
  monthlyUsed: number;
  monthlyLimit: number;
}

export async function checkImageGenerationLimit(
  userId: string,
): Promise<ImageLimitCheck> {
  const [user] = await pgDb
    .select({
      plan: UserTable.plan,
      planId: UserTable.planId,
      planStatus: UserTable.planStatus,
      planExpiresAt: UserTable.planExpiresAt,
    })
    .from(UserTable)
    .where(eq(UserTable.id, userId));

  if (!user) {
    return {
      allowed: false,
      reason: "User not found",
      dailyUsed: 0,
      dailyLimit: 0,
      monthlyUsed: 0,
      monthlyLimit: 0,
    };
  }

  if (user.planStatus !== "active" || new Date(user.planExpiresAt) < new Date()) {
    return {
      allowed: false,
      reason: "Subscription expired or inactive",
      dailyUsed: 0,
      dailyLimit: 0,
      monthlyUsed: 0,
      monthlyLimit: 0,
    };
  }

  let dailyLimit = 0;
  let monthlyLimit = 0;

  if (user.planId) {
    const [customPlan] = await pgDb
      .select({
        limits: SubscriptionPlanTable.limits,
      })
      .from(SubscriptionPlanTable)
      .where(eq(SubscriptionPlanTable.id, user.planId));

    if (customPlan) {
      const limits = customPlan.limits as any;
      dailyLimit = limits?.images?.maxPerDay ?? 0;
      monthlyLimit = limits?.images?.maxPerMonth ?? 0;
    }
  } else if (user.plan) {
    const planLimits = PLAN_LIMITS[user.plan as SubscriptionPlan];
    dailyLimit = planLimits.maxImagesPerDay;
    monthlyLimit = planLimits.maxImagesPerMonth;
  }

  if (dailyLimit === -1 && monthlyLimit === -1) {
    return {
      allowed: true,
      dailyUsed: 0,
      dailyLimit: -1,
      monthlyUsed: 0,
      monthlyLimit: -1,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dailyUsage] = await pgDb
    .select({
      imagesGenerated: DailyUsageSummaryTable.imagesGenerated,
    })
    .from(DailyUsageSummaryTable)
    .where(
      and(
        eq(DailyUsageSummaryTable.userId, userId),
        eq(DailyUsageSummaryTable.date, today),
      ),
    );

  const dailyUsed = dailyUsage?.imagesGenerated ?? 0;

  if (dailyLimit !== -1 && dailyUsed >= dailyLimit) {
    return {
      allowed: false,
      reason: `Daily limit reached (${dailyLimit} images/day)`,
      dailyUsed,
      dailyLimit,
      monthlyUsed: 0,
      monthlyLimit,
    };
  }

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [monthlyUsageResult] = await pgDb
    .select({
      total: sql<number>`COALESCE(SUM(${DailyUsageSummaryTable.imagesGenerated}), 0)`,
    })
    .from(DailyUsageSummaryTable)
    .where(
      and(
        eq(DailyUsageSummaryTable.userId, userId),
        gte(DailyUsageSummaryTable.date, startOfMonth),
      ),
    );

  const monthlyUsed = Number(monthlyUsageResult?.total ?? 0);

  if (monthlyLimit !== -1 && monthlyUsed >= monthlyLimit) {
    return {
      allowed: false,
      reason: `Monthly limit reached (${monthlyLimit} images/month)`,
      dailyUsed,
      dailyLimit,
      monthlyUsed,
      monthlyLimit,
    };
  }

  return {
    allowed: true,
    dailyUsed,
    dailyLimit,
    monthlyUsed,
    monthlyLimit,
  };
}

export async function recordImageGeneration(
  userId: string,
  prompt: string,
  model: string,
  cost?: number,
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await pgDb.transaction(async (tx) => {
    await tx.insert(ImageGenerationTable).values({
      userId,
      prompt,
      model,
      cost: cost?.toString(),
      status: "pending",
    });

    const [existing] = await tx
      .select()
      .from(DailyUsageSummaryTable)
      .where(
        and(
          eq(DailyUsageSummaryTable.userId, userId),
          eq(DailyUsageSummaryTable.date, today),
        ),
      );

    if (existing) {
      await tx
        .update(DailyUsageSummaryTable)
        .set({
          imagesGenerated: sql`${DailyUsageSummaryTable.imagesGenerated} + 1`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(DailyUsageSummaryTable.userId, userId),
            eq(DailyUsageSummaryTable.date, today),
          ),
        );
    } else {
      await tx.insert(DailyUsageSummaryTable).values({
        userId,
        date: today,
        imagesGenerated: 1,
        tokensUsed: 0,
        apiCalls: 0,
        storageUsedGB: "0",
      });
    }
  });
}
