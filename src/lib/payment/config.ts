export function getPaymentLink(plan: "basic" | "pro"): string {
  const links: Record<"basic" | "pro", string> = {
    basic: process.env.NEXT_PUBLIC_STRIPE_BASIC_LINK || "",
    pro: process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "",
  };
  return links[plan];
}

export function getPlanPrice(plan: string): number {
  const prices: Record<string, number> = {
    free: 0,
    basic: 9.99,
    pro: 24.99,
    enterprise: 0,
  };
  return prices[plan] || 0;
}
