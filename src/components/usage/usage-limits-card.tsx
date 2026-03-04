"use client";

import { useEffect, useState } from "react";
import { Card } from "ui/card";
import { Progress } from "ui/progress";
import { Button } from "ui/button";
import { AlertCircle, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface UsageLimits {
  plan: {
    name: string;
    expiresAt: string | null;
  };
  agents: { used: number; limit: number | null };
  workflows: { used: number; limit: number | null };
  mcpServers: { used: number; limit: number | null };
  tokens: { used: number; limit: number | null };
}

export function UsageLimitsCard() {
  const t = useTranslations();
  const [limits, setLimits] = useState<UsageLimits | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading || !limits) {
    return (
      <Card className="p-4 space-y-3">
        <div className="h-4 bg-muted animate-pulse rounded" />
        <div className="h-2 bg-muted animate-pulse rounded" />
        <div className="h-2 bg-muted animate-pulse rounded" />
      </Card>
    );
  }

  const daysLeft = limits.plan.expiresAt
    ? Math.ceil(
        (new Date(limits.plan.expiresAt).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getUsagePercent = (used: number, limit: number | null) => {
    if (limit === null) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getHighestUsage = () => {
    const usages = [
      {
        name: t("Layout.agents"),
        percent: getUsagePercent(limits.agents.used, limits.agents.limit),
        used: limits.agents.used,
        limit: limits.agents.limit,
      },
      {
        name: t("Subscription.workflows"),
        percent: getUsagePercent(limits.workflows.used, limits.workflows.limit),
        used: limits.workflows.used,
        limit: limits.workflows.limit,
      },
      {
        name: t("Subscription.tokensPerMonth"),
        percent: getUsagePercent(limits.tokens.used, limits.tokens.limit),
        used: limits.tokens.used,
        limit: limits.tokens.limit,
      },
    ];
    return usages.reduce((max, curr) => (curr.percent > max.percent ? curr : max));
  };

  const highestUsage = getHighestUsage();
  const isNearLimit = highestUsage.percent >= 80;
  const isAtLimit = highestUsage.percent >= 100;

  return (
    <Card className="p-4 space-y-3 border-sidebar-border bg-sidebar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{limits.plan.name}</span>
        </div>
        {daysLeft !== null && daysLeft <= 15 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{daysLeft}d</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{highestUsage.name}</span>
          <span className="font-medium">
            {highestUsage.used}/{highestUsage.limit || "∞"}
          </span>
        </div>
        <Progress value={highestUsage.percent} className="h-1.5" />
      </div>

      {(isNearLimit || (daysLeft !== null && daysLeft <= 7)) && (
        <div className="flex items-start gap-2 p-2 rounded-md bg-warning/10 border border-warning/20">
          <AlertCircle className="h-3.5 w-3.5 text-warning mt-0.5 flex-shrink-0" />
          <p className="text-xs text-warning">
            {isAtLimit
              ? t("Usage.limitReached")
              : isNearLimit
              ? t("Usage.nearLimit")
              : t("Usage.planExpiring", { days: daysLeft ?? 0 })}
          </p>
        </div>
      )}

      <Link href="/subscription" className="block">
        <Button variant="outline" size="sm" className="w-full">
          {t("Subscription.upgrade")}
        </Button>
      </Link>
    </Card>
  );
}
