import { NextResponse } from "next/server";
import { getSession } from "lib/auth/server";
import { pgDb } from "@/lib/db/pg/db.pg";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const planLimits = {
      free: { agents: 2, workflows: 1, mcpServers: 1, tokens: 50000 },
    };

    const limits = planLimits.free;

    const agentsCount = await pgDb.query.AgentTable?.findMany({
      where: (agents, { eq }) => eq(agents.userId, session.user.id),
    }) || [];

    const workflowsCount = await pgDb.query.WorkflowTable?.findMany({
      where: (workflows, { eq }) => eq(workflows.userId, session.user.id),
    }) || [];

    const mcpServersCount = await pgDb.query.McpServerTable?.findMany({
      where: (mcpServers, { eq }) => eq(mcpServers.userId, session.user.id),
    }) || [];

    return NextResponse.json({
      plan: {
        name: "Free",
        expiresAt: null,
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
