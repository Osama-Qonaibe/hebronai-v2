import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { canCreateResource } from "@/lib/permissions/plan-permissions";
import type { ResourceType } from "@/lib/permissions/plan-permissions";

export async function checkSubscriptionLimit(
  request: NextRequest,
  resource: ResourceType
): Promise<NextResponse | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await canCreateResource(session.user.id, resource);

  if (!check.allowed) {
    return NextResponse.json(
      {
        error: check.reason || `${resource} limit reached`,
        upgrade_url: "/pricing",
      },
      { status: 403 }
    );
  }

  return null;
}
