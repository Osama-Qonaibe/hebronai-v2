import { NextRequest, NextResponse } from "next/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import { SubscriptionPlanTable, SubscriptionPlanEntity } from "@/lib/db/pg/schema.pg";
import { hasAdminPermission } from "@/lib/auth/permissions";
import { auth } from "@/lib/auth/server";
import { desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const includeInactive = searchParams.get("includeInactive") === "true";

    let query = pgDb.select().from(SubscriptionPlanTable);

    if (!includeInactive) {
      query = query.where(
        sql`(admin_settings->>'isActive')::boolean = true`,
      ) as any;
    }

    const plans = await query.orderBy(
      desc(SubscriptionPlanTable.createdAt),
    );

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
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

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const body = await request.json();

    const result = await pgDb
      .insert(SubscriptionPlanTable)
      .values({
        ...body,
        createdBy: session.user.id,
      })
      .returning();

    const newPlan: SubscriptionPlanEntity = result[0];

    return NextResponse.json({ plan: newPlan }, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json(
      { error: "Failed to create plan" },
      { status: 500 },
    );
  }
}
