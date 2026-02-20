import { NextRequest, NextResponse } from "next/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import { PaymentGatewayTable } from "@/lib/db/pg/schema.pg";
import { hasAdminPermission } from "@/lib/auth/permissions";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const [updatedGateway] = await pgDb
      .update(PaymentGatewayTable)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(PaymentGatewayTable.id, params.id))
      .returning();

    if (!updatedGateway) {
      return NextResponse.json(
        { error: "Gateway not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ gateway: updatedGateway });
  } catch (error) {
    console.error("Error updating gateway:", error);
    return NextResponse.json(
      { error: "Failed to update gateway" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    await pgDb
      .delete(PaymentGatewayTable)
      .where(eq(PaymentGatewayTable.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gateway:", error);
    return NextResponse.json(
      { error: "Failed to delete gateway" },
      { status: 500 },
    );
  }
}
