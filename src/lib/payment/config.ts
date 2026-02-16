export const PAYMENT_CONFIG = {
  paypal: {
    username: "virallinkup",
    links: {
      basic: "https://paypal.me/virallinkup/9",
      pro: "https://paypal.me/virallinkup/29",
    },
  },
  stripe: {
    links: {
      basic: process.env.NEXT_PUBLIC_STRIPE_BASIC_LINK || "",
      pro: process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || "",
    },
  },
  bankTransfer: {
    accountNumber: "4316100",
    friendPayNumber: "0566223014",
    bankName: "بنك فلسطين",
    reflectWallet: "566223014",
  },
};

export function getPaymentLink(
  method: "paypal" | "stripe",
  plan: "basic" | "pro",
): string {
  if (method === "paypal") {
    return PAYMENT_CONFIG.paypal.links[plan];
  }
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

export function getBankTransferDetails() {
  return PAYMENT_CONFIG.bankTransfer;
}
