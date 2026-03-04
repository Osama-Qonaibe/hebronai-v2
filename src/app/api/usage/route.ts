import { NextResponse } from "next/server";
import { getSession } from "lib/auth/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/pg/schema.pg";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      with: {
        subscription: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscription = user.subscription;
    const plan = subscription?.plan || "free";

    const planLimits: Record<string, { agents: number | null; workflows: number | null; mcpServers: number | null; tokens: number | null }> = {
      free: { agents: 2, workflows: 1, mcpServers: 1, tokens: 50000 },
      pro: { agents: 10, workflows: 5, mcpServers: 5, tokens: 500000 },
      enterprise: { agents: null, workflows: null, mcpServers: null, tokens: null },
    };

    const limits = planLimits[plan] || planLimits.free;

    const agentsCount = await db.query.agents.findMany({
      where: (agents, { eq }) => eq(agents.userId, session.user.id),
    });

    const workflowsCount = await db.query.workflows?.findMany({
      where: (workflows, { eq }) => eq(workflows.userId, session.user.id),
    }) || [];

    const mcpServersCount = await db.query.mcpServers?.findMany({
      where: (mcpServers, { eq }) => eq(mcpServers.userId, session.user.id),
    }) || [];

    return NextResponse.json({
      plan: {
        name: plan.charAt(0).toUpperCase() + plan.slice(1),
        expiresAt: subscription?.currentPeriodEnd || null,
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
