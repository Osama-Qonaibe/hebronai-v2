"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlanEntity } from "@/lib/db/pg/schema.pg";
import { subscribeToPlan } from "@/app/actions/subscription.actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PricingCardProps {
  plan: PlanEntity;
  isCurrentPlan?: boolean;
  billingCycle?: "monthly" | "yearly";
}

export function PricingCard({
  plan,
  isCurrentPlan = false,
  billingCycle = "monthly",
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  const features = plan.features as {
    maxChatsPerMonth: number | "unlimited";
    maxAgents: number | "unlimited";
    maxWorkflows: number | "unlimited";
    maxMcpServers: number | "unlimited";
    maxFileUploadSizeMB: number;
    customBranding: boolean;
    prioritySupport: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    advancedAnalytics: boolean;
    customDomain: boolean;
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const result = await subscribeToPlan({
        planSlug: plan.slug,
        billingCycle,
      });

      if (result.success) {
        toast.success("Successfully subscribed!");
        router.push("/settings/subscription");
      } else {
        toast.error(result.error || "Failed to subscribe");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        "relative p-6 border-2 transition-all hover:shadow-lg",
        isCurrentPlan
          ? "border-primary bg-accent/50"
          : "border-border hover:border-primary/50"
      )}
    >
      {plan.badge && (
        <Badge
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground"
        >
          {plan.badge}
        </Badge>
      )}

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2">
          {plan.icon && <span className="text-3xl">{plan.icon}</span>}
          <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-foreground">${price}</span>
          <span className="text-muted-foreground">
            /{billingCycle === "monthly" ? "mo" : "yr"}
          </span>
        </div>
        {billingCycle === "yearly" && plan.yearlyPrice > 0 && (
          <p className="text-sm text-primary mt-1">
            Save ${plan.monthlyPrice * 12 - plan.yearlyPrice}/year
          </p>
        )}
      </div>

      <ul className="space-y-3 mb-6">
        <li className="flex items-center gap-2">
          <Check className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground">
            {features.maxChatsPerMonth === "unlimited"
              ? "Unlimited chats"
              : `${features.maxChatsPerMonth} chats/month`}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground">
            {features.maxAgents === "unlimited"
              ? "Unlimited agents"
              : `${features.maxAgents} agents`}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground">
            {features.maxWorkflows === "unlimited"
              ? "Unlimited workflows"
              : `${features.maxWorkflows} workflows`}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Check className="w-5 h-5 text-primary flex-shrink-0" />
          <span className="text-sm text-foreground">
            {features.maxMcpServers === "unlimited"
              ? "Unlimited MCP servers"
              : `${features.maxMcpServers} MCP servers`}
          </span>
        </li>
        {features.apiAccess && (
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">API access</span>
          </li>
        )}
        {features.advancedAnalytics && (
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">Advanced analytics</span>
          </li>
        )}
        {features.prioritySupport && (
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary flex-shrink-0" />
            <span className="text-sm text-foreground">Priority support</span>
          </li>
        )}
      </ul>

      <Button
        className={cn(
          "w-full",
          isCurrentPlan
            ? "bg-secondary text-secondary-foreground cursor-default"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
        disabled={isCurrentPlan || loading}
        onClick={handleSubscribe}
      >
        {loading
          ? "Processing..."
          : isCurrentPlan
            ? "Current Plan"
            : "Subscribe"}
      </Button>
    </Card>
  );
}