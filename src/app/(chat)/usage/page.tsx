import { auth } from "auth/server";
import { getMySubscription } from "@/app/actions/subscription.actions";
import { getRemainingQuota, getUsageStats } from "@/lib/permissions/plan-permissions";
import { UsageCard } from "@/components/usage/usage-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UsagePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { data: subscription } = await getMySubscription();
  
  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription. Subscribe to a plan to start using the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button>
                View Plans <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const chatsQuota = await getRemainingQuota(session.user.id, "chats");
  const agentsQuota = await getRemainingQuota(session.user.id, "agents");
  const workflowsQuota = await getRemainingQuota(session.user.id, "workflows");
  const mcpServersQuota = await getRemainingQuota(session.user.id, "mcpServers");
  const usage = await getUsageStats(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Usage Dashboard</h1>
        <p className="text-muted-foreground">
          Track your usage and remaining quota for your {subscription.plan.name} plan
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <UsageCard
          title="Chats"
          description="Monthly chat conversations"
          current={usage?.chatsThisMonth || 0}
          total={chatsQuota.total}
          remaining={chatsQuota.remaining}
        />
        <UsageCard
          title="Agents"
          description="Custom AI agents created"
          current={usage?.agentsCreated || 0}
          total={agentsQuota.total}
          remaining={agentsQuota.remaining}
        />
        <UsageCard
          title="Workflows"
          description="Automated workflows"
          current={usage?.workflowsCreated || 0}
          total={workflowsQuota.total}
          remaining={workflowsQuota.remaining}
        />
        <UsageCard
          title="MCP Servers"
          description="Connected MCP servers"
          current={usage?.mcpServersAdded || 0}
          total={mcpServersQuota.total}
          remaining={mcpServersQuota.remaining}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Need More Resources?</CardTitle>
          <CardDescription>
            Upgrade your plan to get access to more features and higher limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/pricing">
            <Button>
              View Upgrade Options <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}