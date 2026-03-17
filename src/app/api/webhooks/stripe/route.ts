import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { pgUserRepository } from "@/lib/db/pg/repositories/user-repository.pg";
import { subscriptionRequestRepository } from "@/lib/db/pg/repositories/subscription-request-repository.pg";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });
}

function calculateExpiry(subscriptionType: string): Date {
  const date = new Date();
  if (subscriptionType === "yearly") {
    date.setFullYear(date.getFullYear() + 1);
  } else {
    date.setMonth(date.getMonth() + 1);
  }
  return date;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plan, subscriptionType } = session.metadata || {};

    if (!userId || !plan) {
      console.error("[WEBHOOK] Missing metadata", session.metadata);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    try {
      const expiresAt = calculateExpiry(subscriptionType || "monthly");

      await pgUserRepository.updateSubscription(userId, plan, "active", expiresAt);

      await subscriptionRequestRepository.create({
        userId,
        requestedPlan: plan,
        subscriptionType: (subscriptionType as "monthly" | "yearly") || "monthly",
        paymentMethod: "stripe",
        amount: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || "USD",
        transactionId: session.payment_intent as string || session.id,
        notes: `Auto-activated via Stripe Checkout. Session: ${session.id}`,
      });

      console.log(`[WEBHOOK] Activated plan '${plan}' for user ${userId}`);
    } catch (err) {
      console.error("[WEBHOOK] Activation failed", err);
      return NextResponse.json({ error: "Activation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
