import { NextResponse } from "next/server";
import { getSession } from "lib/auth/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import { UserTable, ImageGenerationTable } from "@/lib/db/pg/schema.pg";
import { eq, and, gte, sql } from "drizzle-orm";
import { customModelProvider } from "@/lib/ai/models";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await pgDb
      .select({
        plan: UserTable.plan,
        planStatus: UserTable.planStatus,
        planExpiresAt: UserTable.planExpiresAt,
        planId: UserTable.planId,
      })
      .from(UserTable)
      .where(eq(UserTable.id, session.user.id))
      .limit(1);

    if (!user || user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userPlan = user[0].plan || "free";
    const planStatus = user[0].planStatus;
    const expiresAt = user[0].planExpiresAt;

    const planLimits: Record<
      string,
      {
        agents: number | null;
        workflows: number | null;
        mcpServers: number | null;
        tokens: number | null;
        imagesDaily: number | null;
        imagesMonthly: number | null;
      }
    > = {
      free: { 
        agents: 2, 
        workflows: 1, 
        mcpServers: 1, 
        tokens: 50000,
        imagesDaily: 5,
        imagesMonthly: 50,
      },
      basic: { 
        agents: 5, 
        workflows: 3, 
        mcpServers: 3, 
        tokens: 200000,
        imagesDaily: 20,
        imagesMonthly: 300,
      },
      pro: { 
        agents: 10, 
        workflows: 10, 
        mcpServers: 10, 
        tokens: 1000000,
        imagesDaily: 50,
        imagesMonthly: 1000,
      },
      enterprise: { 
        agents: null, 
        workflows: null, 
        mcpServers: null, 
        tokens: null,
        imagesDaily: null,
        imagesMonthly: null,
      },
    };

    const limits = planLimits[userPlan] || planLimits.free;

    const agentsCount =
      (await pgDb.query.AgentTable?.findMany({
        where: (agents, { eq }) => eq(agents.userId, session.user.id),
      })) || [];

    const workflowsCount =
      (await pgDb.query.WorkflowTable?.findMany({
        where: (workflows, { eq }) => eq(workflows.userId, session.user.id),
      })) || [];

    const mcpServersCount =
      (await pgDb.query.McpServerTable?.findMany({
        where: (mcpServers, { eq }) => eq(mcpServers.userId, session.user.id),
      })) || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const imagesDaily = await pgDb
      .select({ count: sql<number>`count(*)::int` })
      .from(ImageGenerationTable)
      .where(
        and(
          eq(ImageGenerationTable.userId, session.user.id),
          gte(ImageGenerationTable.createdAt, today),
          eq(ImageGenerationTable.status, "completed")
        )
      );

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const imagesMonthly = await pgDb
      .select({ count: sql<number>`count(*)::int` })
      .from(ImageGenerationTable)
      .where(
        and(
          eq(ImageGenerationTable.userId, session.user.id),
          gte(ImageGenerationTable.createdAt, firstDayOfMonth),
          eq(ImageGenerationTable.status, "completed")
        )
      );

    const modelsCount = customModelProvider.modelsInfo.reduce(
      (total, provider) => total + provider.models.length,
      0
    );

    return NextResponse.json({
      plan: {
        name: userPlan.charAt(0).toUpperCase() + userPlan.slice(1),
        status: planStatus,
        expiresAt: expiresAt?.toISOString() || null,
        modelsCount,
      },
      agents: {
        used: agentsCount.length,
        limit: limits.agents,
      },
      workflows: {
        used: workflowsCount.length,
        limit: limits.workflows,
      },
      mcpServers: {
        used: mcpServersCount.length,
        limit: limits.mcpServers,
      },
      tokens: {
        used: 0,
        limit: limits.tokens,
      },
      images: {
        daily: {
          used: imagesDaily[0]?.count || 0,
          limit: limits.imagesDaily,
        },
        monthly: {
          used: imagesMonthly[0]?.count || 0,
          limit: limits.imagesMonthly,
        },
      },
    });
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
