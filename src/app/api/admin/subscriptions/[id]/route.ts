import { NextRequest, NextResponse } from "next/server";
import {
  requireAdmin,
  UnauthorizedError,
  ForbiddenError,
} from "@/lib/auth/admin-guard";
import { adminRepository } from "@/lib/db/repository";
import { pgDb as db } from "@/lib/db/pg/db.pg";
import { SubscriptionRequestTable } from "@/lib/db/pg/schema.pg";
import { eq } from "drizzle-orm";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();

    const { action, adminNotes } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 },
      );
    }

    if (action === "approve") {
      await adminRepository.approveSubscriptionRequest(
        id,
        session.user.id,
        adminNotes,
      );
    } else {
      await adminRepository.rejectSubscriptionRequest(
        id,
        session.user.id,
        adminNotes,
      );
    }

    return NextResponse.json({
      success: true,
      message: `Subscription request ${action}d successfully`,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    console.error("Error processing subscription request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;

    const [existingRequest] = await db
      .select()
      .from(SubscriptionRequestTable)
      .where(eq(SubscriptionRequestTable.id, id));

    if (!existingRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (existingRequest.status !== "rejected") {
      return NextResponse.json(
        { error: "Only rejected requests can be deleted" },
        { status: 400 },
      );
    }

    await db
      .delete(SubscriptionRequestTable)
      .where(eq(SubscriptionRequestTable.id, id));

    return NextResponse.json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    if (error instanceof ForbiddenError) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    console.error("Error deleting subscription request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
