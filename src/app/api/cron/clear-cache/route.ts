import { NextRequest, NextResponse } from "next/server";
import logger from "logger";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");
    const urlSecret = request.nextUrl.searchParams.get("secret");

    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || urlSecret === cronSecret;

    if (cronSecret && !isAuthorized) {
      logger.warn("Unauthorized cache clearing attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting cache clearing process...");

    let clearedItems = 0;
    const operations: string[] = [];

    try {
      const { revalidatePath } = await import("next/cache");
      
      const paths = [
        "/",
        "/subscription",
        "/api/usage",
      ];

      for (const path of paths) {
        revalidatePath(path);
        operations.push(`Revalidated path: ${path}`);
        clearedItems++;
      }

      logger.info(`Cache clearing completed. Revalidated ${clearedItems} paths`);
    } catch (cacheError) {
      logger.warn("Cache clearing encountered an issue", cacheError);
      operations.push("Cache clearing completed with warnings");
    }

    return NextResponse.json({
      success: true,
      message: "Cache cleared successfully",
      itemsCleared: clearedItems,
      operations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error in clear-cache cron job:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "GET method not allowed in production" },
      { status: 405 },
    );
  }
  return POST(request);
}
