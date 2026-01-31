"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface UsageCardProps {
  title: string;
  description: string;
  current: number;
  total: number | "unlimited";
  remaining: number | "unlimited";
}

export function UsageCard({
  title,
  description,
  current,
  total,
  remaining,
}: UsageCardProps) {
  const percentage = total === "unlimited" ? 0 : (current / (total as number)) * 100;
  const isUnlimited = total === "unlimited";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-medium">
              {current} {!isUnlimited && `/ ${total}`}
            </span>
          </div>
          {!isUnlimited && (
            <>
              <Progress value={percentage} className="h-2" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Remaining</span>
                <span className="font-medium">{remaining}</span>
              </div>
            </>
          )}
          {isUnlimited && (
            <p className="text-sm text-primary font-medium">✨ Unlimited</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}