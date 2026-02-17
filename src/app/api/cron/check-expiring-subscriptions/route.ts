import { NextRequest, NextResponse } from "next/server";
import { checkAndSendExpirationWarnings } from "@/lib/email/notifications";
import logger from "logger";

/**
 * Cron job endpoint to check and send expiration warnings
 * This should be called daily by a cron service (e.g., Vercel Cron, cPanel Cron)
 *
 * Setup:
 * 1. For Vercel: Add to vercel.json:
 *    {
 *      "crons": [{
 *        "path": "/api/cron/check-expiring-subscriptions",
 *        "schedule": "0 9 * * *"
 *      }]
 *    }
 *
 * 2. For cPanel: Add cron job:
 *    0 9 * * * curl -X POST https://yourdomain.com/api/cron/check-expiring-subscriptions?secret=YOUR_CRON_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");
    const urlSecret = request.nextUrl.searchParams.get("secret");

    // Check if request is authorized (either via header or URL param)
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` || urlSecret === cronSecret;

    if (cronSecret && !isAuthorized) {
      logger.warn("Unauthorized cron job attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting subscription expiration check...");

    // Check and send expiration warnings
    await checkAndSendExpirationWarnings();

    logger.info("Subscription expiration check completed successfully");

    return NextResponse.json({
      success: true,
      message: "Expiration warnings checked and sent",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error in check-expiring-subscriptions cron job:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Also support GET for testing purposes (only in development)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "GET method not allowed in production" },
      { status: 405 },
    );
  }

  return POST(request);
}
