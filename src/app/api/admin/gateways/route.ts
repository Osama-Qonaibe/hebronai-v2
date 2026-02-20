import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PaymentGatewayTable } from "@/lib/db/pg/schema.pg";
import { hasAdminPermission } from "@/lib/auth/permissions";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const gateways = await db
      .select()
      .from(PaymentGatewayTable)
      .orderBy(desc(PaymentGatewayTable.createdAt));

    return NextResponse.json({ gateways });
  } catch (error) {
    console.error("Error fetching gateways:", error);
    return NextResponse.json(
      { error: "Failed to fetch gateways" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const [newGateway] = await db
      .insert(PaymentGatewayTable)
      .values(body)
      .returning();

    return NextResponse.json({ gateway: newGateway }, { status: 201 });
  } catch (error) {
    console.error("Error creating gateway:", error);
    return NextResponse.json(
      { error: "Failed to create gateway" },
      { status: 500 },
    );
  }
}
