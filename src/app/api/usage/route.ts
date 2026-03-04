import { getSession } from "lib/auth/server";
import { getUserUsageLimits } from "lib/auth/usage-limits";

export async function GET() {
  const session = await getSession();

  if (!session?.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const usageLimits = await getUserUsageLimits(session.user.id);

    if (!usageLimits) {
      return Response.json(
        { error: "Failed to get usage limits" },
        { status: 500 }
      );
    }

    return Response.json(usageLimits);
  } catch (error) {
    console.error("Failed to get usage limits:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
