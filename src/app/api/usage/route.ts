import { NextResponse } from "next/server";
import { getSession } from "lib/auth/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import { UserTable } from "@/lib/db/pg/schema.pg";
import { eq } from "drizzle-orm";

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
        models: number;
      }
    > = {
      free: { 
        agents: 2, 
        workflows: 1, 
        mcpServers: 1, 
        tokens: 50000,
        models: 12,
      },
      basic: { 
        agents: 5, 
        workflows: 3, 
        mcpServers: 3, 
        tokens: 200000,
        models: 17,
      },
      pro: { 
        agents: 10, 
        workflows: 10, 
        mcpServers: 10, 
        tokens: 1000000,
        models: 25,
      },
      enterprise: { 
        agents: null, 
        workflows: null, 
        mcpServers: null, 
        tokens: null,
        models: 45,
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

    return NextResponse.json({
      plan: {
        name: userPlan.charAt(0).toUpperCase() + userPlan.slice(1),
        status: planStatus,
        expiresAt: expiresAt?.toISOString() || null,
        modelsCount: limits.models,
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
    });
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
