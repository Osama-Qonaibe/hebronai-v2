import { NextRequest, NextResponse } from "next/server";
import { getSession } from "auth/server";
import { getUserSubscription } from "lib/auth/subscription";
import { userRepository } from "lib/db/repository";

export async function GET() {
  try {
    const subscription = await getUserSubscription();

    if (!subscription) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, status, expiresAt } = body;

    if (!plan || !status) {
      return NextResponse.json(
        { error: "Missing required fields: plan, status" },
        { status: 400 }
      );
    }

    const validPlans = ["free", "basic", "pro", "enterprise"];
    const validStatuses = ["active", "expired", "cancelled", "trial"];

    if (!validPlans.includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    await userRepository.updateSubscription(
      session.user.id,
      plan,
      status,
      expiresAt ? new Date(expiresAt) : null
    );

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
