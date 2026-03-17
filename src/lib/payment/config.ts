export const PAYMENT_CONFIG = {
  stripe: {
    priceIds: {
      basic: {
        monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || "",
        yearly: process.env.STRIPE_PRICE_BASIC_YEARLY || "",
      },
      pro: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
        yearly: process.env.STRIPE_PRICE_PRO_YEARLY || "",
      },
    },
  },
  bankTransfer: {
    accountNumber: "4316100",
    friendPayNumber: "0566223014",
    bankName: "بنك فلسطين",
    reflectWallet: "566223014",
  },
};

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
