import { pgDb as db } from "../db.pg";
import { SubscriptionRequestTable } from "../schema.pg";
import { eq, and, desc } from "drizzle-orm";

export type RequestStatus = "pending" | "approved" | "rejected" | "processing";
export type PaymentMethod = "stripe" | "paypal" | "bank_transfer" | "manual";
export type RequestedPlan = "free" | "basic" | "pro" | "enterprise";

export interface CreateSubscriptionRequestData {
  userId: string;
  requestedPlan: RequestedPlan;
  paymentMethod: PaymentMethod;
  amount?: number;
  currency?: string;
  proofImageUrl?: string;
  transactionId?: string;
  notes?: string;
}

export const subscriptionRequestRepository = {
  create: async (data: CreateSubscriptionRequestData) => {
    const [request] = await db
      .insert(SubscriptionRequestTable)
      .values({
        userId: data.userId,
        requestedPlan: data.requestedPlan,
        paymentMethod: data.paymentMethod,
        amount: data.amount?.toString(),
        currency: data.currency || "USD",
        status: "pending",
        proofImageUrl: data.proofImageUrl,
        transactionId: data.transactionId,
        notes: data.notes,
      })
      .returning();

    return request;
  },

  getUserRequests: async (userId: string) => {
    return await db
      .select()
      .from(SubscriptionRequestTable)
      .where(eq(SubscriptionRequestTable.userId, userId))
      .orderBy(SubscriptionRequestTable.createdAt);
  },

  getLatestUserRequest: async (userId: string) => {
    const [request] = await db
      .select()
      .from(SubscriptionRequestTable)
      .where(eq(SubscriptionRequestTable.userId, userId))
      .orderBy(SubscriptionRequestTable.createdAt)
      .limit(1);

    return request;
  },

  getPendingRequest: async (userId: string) => {
    const [request] = await db
      .select()
      .from(SubscriptionRequestTable)
      .where(
        and(
          eq(SubscriptionRequestTable.userId, userId),
          eq(SubscriptionRequestTable.status, "pending"),
        ),
      )
      .orderBy(desc(SubscriptionRequestTable.createdAt))
      .limit(1);

    return request || null;
  },
};
