import { NextRequest, NextResponse } from "next/server";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import { UserTable, SubscriptionRequestTable } from "@/lib/db/pg/schema.pg";
import { eq } from "drizzle-orm";
import pgAdminRepository from "@/lib/db/pg/repositories/admin-respository.pg";

const PLAN_MAP: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_BASIC_LINK || ""]: "basic",
  [process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || ""]: "pro",
};

function getPlanFromSession(session: any): string | null {
  const paymentLink = session?.payment_link;
  if (paymentLink && PLAN_MAP[`https://buy.stripe.com/${paymentLink}`]) {
    return PLAN_MAP[`https://buy.stripe.com/${paymentLink}`];
  }
  const metadata = session?.metadata?.plan;
  if (metadata) return metadata;
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: any;
  try {
    const stripe = (await import("stripe")).default;
    const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY!);
    event = stripeClient.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("[STRIPE WEBHOOK] No client_reference_id in session");
      return NextResponse.json({ error: "No user ID" }, { status: 400 });
    }

    const plan = getPlanFromSession(session);
    if (!plan) {
      console.error("[STRIPE WEBHOOK] Could not determine plan");
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    try {
      const [user] = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.id, userId))
        .limit(1);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const [request] = await db
        .insert(SubscriptionRequestTable)
        .values({
          userId,
          requestedPlan: plan,
          subscriptionType: "monthly",
          paymentMethod: "stripe",
          amount: session.amount_total ? (session.amount_total / 100).toString() : "0",
          currency: session.currency?.toUpperCase() || "USD",
          transactionId: session.payment_intent || session.id,
          notes: `Auto-activated via Stripe webhook. Session: ${session.id}`,
          status: "pending",
        })
        .returning();

      const adminUser = await db
        .select()
        .from(UserTable)
        .where(eq(UserTable.role, "admin"))
        .limit(1)
        .then((r) => r[0]);

      await pgAdminRepository.approveSubscriptionRequest(
        request.id,
        adminUser?.id || userId,
        "Auto-approved via Stripe payment",
      );

      console.log(`[STRIPE WEBHOOK] Activated ${plan} for user ${userId}`);
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("[STRIPE WEBHOOK ERROR]", err);
      return NextResponse.json({ error: "Activation failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
