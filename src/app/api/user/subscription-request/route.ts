import { NextRequest, NextResponse } from "next/server";
import { getSession } from "auth/server";
import { subscriptionRequestRepository } from "@/lib/db/pg/repositories/subscription-request-repository.pg";
import { z } from "zod";

const createRequestSchema = z.object({
  requestedPlan: z.enum(["free", "basic", "pro", "enterprise"]),
  paymentMethod: z.enum(["stripe", "paypal", "bank_transfer", "manual"]),
  amount: z.number().optional(),
  currency: z.string().default("USD"),
  proofImageUrl: z.string().optional(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = createRequestSchema.parse(body);

    const result = await subscriptionRequestRepository.create({
      userId: session.user.id,
      ...validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Subscription request submitted successfully",
        requestId: result.id,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", issues: err.issues },
        { status: 400 }
      );
    }

    console.error("Error creating subscription request:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requests = await subscriptionRequestRepository.getUserRequests(
      session.user.id
    );

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Error fetching subscription requests:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
