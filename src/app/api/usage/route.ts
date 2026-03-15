import { NextResponse } from "next/server";
import { getSession } from "lib/auth/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import {
  UserTable,
  AgentTable,
  WorkflowTable,
  McpServerTable,
  DailyUsageSummaryTable,
} from "@/lib/db/pg/schema.pg";
import { eq, and, gte, sql } from "drizzle-orm";
import { PLAN_LIMITS } from "@/lib/subscription/plans";
import type { SubscriptionPlan } from "@/lib/subscription/plans";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await pgDb
      .select({
        plan: UserTable.plan,
        planStatus: UserTable.planStatus,
        planExpiresAt: UserTable.planExpiresAt,
      })
      .from(UserTable)
      .where(eq(UserTable.id, session.user.id));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPlan = (user.plan || "free") as SubscriptionPlan;
    const limits = PLAN_LIMITS[userPlan] ?? PLAN_LIMITS.free;

    const modelsCount: Record<SubscriptionPlan, number> = {
      free: 12,
      basic: 17,
      pro: 25,
      enterprise: 45,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [agentsResult, workflowsResult, mcpServersResult] = await Promise.all(
      [
        pgDb
          .select({ count: sql<number>`count(*)::int` })
          .from(AgentTable)
          .where(eq(AgentTable.userId, session.user.id)),
        pgDb
          .select({ count: sql<number>`count(*)::int` })
          .from(WorkflowTable)
          .where(eq(WorkflowTable.userId, session.user.id)),
        pgDb
          .select({ count: sql<number>`count(*)::int` })
          .from(McpServerTable)
          .where(eq(McpServerTable.userId, session.user.id)),
      ],
    );

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [dailyRow] = await pgDb
      .select({ imagesGenerated: DailyUsageSummaryTable.imagesGenerated })
      .from(DailyUsageSummaryTable)
      .where(
        and(
          eq(DailyUsageSummaryTable.userId, session.user.id),
          eq(DailyUsageSummaryTable.date, today),
        ),
      );

    const [monthlyRow] = await pgDb
      .select({
        total: sql<number>`COALESCE(SUM(${DailyUsageSummaryTable.imagesGenerated}), 0)`,
      })
      .from(DailyUsageSummaryTable)
      .where(
        and(
          eq(DailyUsageSummaryTable.userId, session.user.id),
          gte(DailyUsageSummaryTable.date, startOfMonth),
        ),
      );

    return NextResponse.json({
      plan: {
        name: userPlan.charAt(0).toUpperCase() + userPlan.slice(1),
        status: user.planStatus,
        expiresAt: user.planExpiresAt?.toISOString() || null,
        modelsCount: modelsCount[userPlan] ?? 12,
      },
      agents: {
        used: agentsResult[0]?.count ?? 0,
        limit: limits.maxAgents === -1 ? null : limits.maxAgents,
      },
      workflows: {
        used: workflowsResult[0]?.count ?? 0,
        limit: limits.maxWorkflows === -1 ? null : limits.maxWorkflows,
      },
      mcpServers: {
        used: mcpServersResult[0]?.count ?? 0,
        limit: limits.maxMCPServers === -1 ? null : limits.maxMCPServers,
      },
      tokens: {
        used: 0,
        limit:
          limits.maxTokensPerMonth === -1 ? null : limits.maxTokensPerMonth,
      },
      images: {
        daily: {
          used: dailyRow?.imagesGenerated ?? 0,
          limit: limits.maxImagesPerDay === -1 ? null : limits.maxImagesPerDay,
        },
        monthly: {
          used: Number(monthlyRow?.total ?? 0),
          limit:
            limits.maxImagesPerMonth === -1 ? null : limits.maxImagesPerMonth,
        },
      },
    });
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
