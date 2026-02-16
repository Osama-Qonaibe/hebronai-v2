import type { SubscriptionPlan } from "./plans";

export interface ExpirationConfig {
  duration: number;
  unit: "days" | "months" | "years";
}

const PLAN_DURATIONS: Record<SubscriptionPlan, ExpirationConfig> = {
  free: { duration: 30, unit: "days" },
  basic: { duration: 1, unit: "months" },
  pro: { duration: 1, unit: "months" },
  enterprise: { duration: 1, unit: "years" },
};

export function calculateExpirationDate(
  plan: SubscriptionPlan,
  startDate: Date = new Date(),
): Date {
  const config = PLAN_DURATIONS[plan];
  const expirationDate = new Date(startDate);

  switch (config.unit) {
    case "days":
      expirationDate.setDate(expirationDate.getDate() + config.duration);
      break;
    case "months":
      expirationDate.setMonth(expirationDate.getMonth() + config.duration);
      break;
    case "years":
      expirationDate.setFullYear(
        expirationDate.getFullYear() + config.duration,
      );
      break;
  }

  return expirationDate;
}

export function isExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
}

export function getDaysRemaining(expiresAt: Date | null): number {
  if (!expiresAt) return 0;
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
