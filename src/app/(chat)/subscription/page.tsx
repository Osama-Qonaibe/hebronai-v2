import { auth } from "auth/server";
import { getMySubscription } from "@/app/actions/subscription.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CancelSubscriptionButton } from "@/components/subscription/cancel-subscription-button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SubscriptionPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { data: subscription } = await getMySubscription();

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription. Choose a plan to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/pricing">
              <Button>
                Browse Plans <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { plan } = subscription;
  const sub = subscription.subscription;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing settings
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {plan.icon && <span className="text-2xl">{plan.icon}</span>}
                  {plan.name} Plan
                </CardTitle>
                <CardDescription>Your current subscription plan</CardDescription>
              </div>
              <Badge
                variant={sub.status === "active" ? "default" : "secondary"}
              >
                {sub.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Billing Cycle</p>
                <p className="font-medium capitalize">{sub.billingCycle}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Started</p>
                <p className="font-medium">
                  {new Date(sub.startDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Plan Features</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Chats: {plan.features.maxChatsPerMonth === "unlimited" ? "Unlimited" : plan.features.maxChatsPerMonth}</div>
                <div>• Agents: {plan.features.maxAgents === "unlimited" ? "Unlimited" : plan.features.maxAgents}</div>
                <div>• Workflows: {plan.features.maxWorkflows === "unlimited" ? "Unlimited" : plan.features.maxWorkflows}</div>
                <div>• MCP Servers: {plan.features.maxMcpServers === "unlimited" ? "Unlimited" : plan.features.maxMcpServers}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Change your plan or cancel your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/pricing">
              <Button variant="outline" className="w-full">
                Change Plan <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <CancelSubscriptionButton />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}