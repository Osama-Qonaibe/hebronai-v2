"use client";

import { useEffect, useState } from "react";
import { Button } from "ui/button";
import { AlertCircle, Calendar, Zap, Crown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "ui/dialog";
import { Progress } from "ui/progress";

interface UsageLimits {
  plan: {
    name: string;
    status?: string;
    expiresAt: string | null;
    modelsCount?: number;
  };
  agents: { used: number; limit: number | null };
  workflows: { used: number; limit: number | null };
  mcpServers: { used: number; limit: number | null };
  tokens: { used: number; limit: number | null };
  images?: {
    daily: { used: number; limit: number | null };
    monthly: { used: number; limit: number | null };
  };
}

export function UsageLimitsCard() {
  const t = useTranslations();
  const [limits, setLimits] = useState<UsageLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchLimits() {
      try {
        const res = await fetch("/api/usage");
        if (res.ok) {
          const data = await res.json();
          setLimits(data);
        }
      } catch (error) {
        console.error("Failed to fetch usage limits:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLimits();
  }, []);

  const daysLeft = limits?.plan.expiresAt
    ? Math.ceil(
        (new Date(limits.plan.expiresAt).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getUsagePercent = (used: number, limit: number | null) => {
    if (limit === null) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const resources = limits
    ? [
        {
          name: t("Layout.agents"),
          used: limits.agents.used,
          limit: limits.agents.limit,
          percent: getUsagePercent(limits.agents.used, limits.agents.limit),
          format: false,
        },
        {
          name: t("Subscription.workflows"),
          used: limits.workflows.used,
          limit: limits.workflows.limit,
          percent: getUsagePercent(limits.workflows.used, limits.workflows.limit),
          format: false,
        },
        {
          name: "MCP Servers",
          used: limits.mcpServers.used,
          limit: limits.mcpServers.limit,
          percent: getUsagePercent(limits.mcpServers.used, limits.mcpServers.limit),
          format: false,
        },
        {
          name: t("Subscription.tokensPerMonth"),
          used: limits.tokens.used,
          limit: limits.tokens.limit,
          percent: getUsagePercent(limits.tokens.used, limits.tokens.limit),
          format: true,
        },
        ...(limits.images
          ? [
              {
                name: "Images Today",
                used: limits.images.daily.used,
                limit: limits.images.daily.limit,
                percent: getUsagePercent(
                  limits.images.daily.used,
                  limits.images.daily.limit
                ),
                format: false,
              },
              {
                name: "Images/Month",
                used: limits.images.monthly.used,
                limit: limits.images.monthly.limit,
                percent: getUsagePercent(
                  limits.images.monthly.used,
                  limits.images.monthly.limit
                ),
                format: false,
              },
            ]
          : []),
      ]
    : [];

  const highestUsage = resources.length
    ? resources.reduce((max, curr) => (curr.percent > max.percent ? curr : max))
    : null;
  const isNearLimit = highestUsage ? highestUsage.percent >= 80 : false;
  const isAtLimit = highestUsage ? highestUsage.percent >= 100 : false;
  const isEnterprise = limits?.plan.name === "Enterprise";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 relative"
          disabled={loading}
        >
          <Crown
            className={`h-4 w-4 ${
              limits?.plan.name !== "Free" ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <span className="flex-1 text-left truncate">
            {loading ? "..." : limits?.plan.name || "Plan"}
          </span>
          {isNearLimit && (
            <span className="h-2 w-2 bg-warning rounded-full animate-pulse" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>
              {limits?.plan.name} Plan
              {limits?.plan.modelsCount && (
                <span className="text-muted-foreground font-normal"> • {limits.plan.modelsCount} Models</span>
              )}
            </span>
          </DialogTitle>
        </DialogHeader>

        {limits && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {limits.plan.status && (
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
                    {limits.plan.status}
                  </span>
                )}
              </div>
              {daysLeft !== null && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{daysLeft} days left</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {resource.name}
                    </span>
                    <span className="font-medium tabular-nums">
                      {resource.format
                        ? formatNumber(resource.used)
                        : resource.used}
                      <span className="text-muted-foreground">
                        /
                        {resource.limit === null
                          ? "∞"
                          : resource.format
                          ? formatNumber(resource.limit)
                          : resource.limit}
                      </span>
                    </span>
                  </div>
                  <Progress value={resource.percent} className="h-2" />
                </div>
              ))}
            </div>

            {(isNearLimit || (daysLeft !== null && daysLeft <= 7)) && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm text-warning">
                  {isAtLimit
                    ? t("Usage.limitReached")
                    : isNearLimit
                    ? t("Usage.nearLimit")
                    : t("Usage.planExpiring", { days: daysLeft ?? 0 })}
                </p>
              </div>
            )}

            <Link href="/subscription" onClick={() => setOpen(false)}>
              <Button
                variant={isEnterprise ? "outline" : "default"}
                className="w-full gap-2"
              >
                <Crown className="h-4 w-4" />
                {isEnterprise
                  ? t("Subscription.manageSubscription")
                  : t("Subscription.upgrade")}
              </Button>
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
