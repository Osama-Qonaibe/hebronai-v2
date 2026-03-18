export const PAYMENT_CONFIG = {
  stripe: {
    links: {
      basic: process.env.NEXT_PUBLIC_STRIPE_BASIC_LINK || "",
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "",
    },
  },
};

export function getPaymentLink(
  plan: "basic" | "pro",
): string {
  return PAYMENT_CONFIG.stripe.links[plan];
}

export function getPlanPrice(plan: string): number {
  const prices: Record<string, number> = {
    free: 0,
    basic: 9,
    pro: 29,
    enterprise: 0,
  };
  return prices[plan] || 0;
}
