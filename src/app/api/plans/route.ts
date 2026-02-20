import { NextResponse } from "next/server";
import { db } from "@/lib/db/pg/db.pg";
import { SubscriptionPlanTable } from "@/lib/db/pg/schema.pg";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const plans = await db
      .select()
      .from(SubscriptionPlanTable)
      .where(
        sql`(admin_settings->>'isActive')::boolean = true AND (admin_settings->>'isVisible')::boolean = true`,
      )
      .orderBy(sql`(metadata->>'order')::integer`);

    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans" },
      { status: 500 },
    );
  }
}
