import { NextRequest, NextResponse } from "next/server";
import {
  requireAdmin,
  UnauthorizedError,
  ForbiddenError,
} from "@/lib/auth/admin-guard";
import { adminRepository } from "@/lib/db/repository";
import type { RequestStatus } from "@/lib/db/pg/repositories/subscription-request-repository.pg";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const statusParam = searchParams.get("status");

    const validStatuses: RequestStatus[] = [
      "pending",
      "approved",
      "rejected",
      "processing",
    ];
    const status =
      statusParam && validStatuses.includes(statusParam as RequestStatus)
        ? (statusParam as RequestStatus)
        : undefined;

    const requests = await adminRepository.getSubscriptionRequests(status);

    return NextResponse.json(requests);
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

    console.error("Error fetching subscription requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
