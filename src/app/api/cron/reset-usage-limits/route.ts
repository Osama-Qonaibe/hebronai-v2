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
      logger.warn("Unauthorized usage limits reset attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting usage limits reset...");

    const { pgDb } = await import("lib/db/pg/db.pg");
    const { UserTable, ImageGenerationTable, DailyUsageSummaryTable } = await import("lib/db/pg/schema.pg");
    const { lte, eq, and } = await import("drizzle-orm");

    const results = {
      expiredPlans: 0,
      downgradedUsers: 0,
      deletedOldImages: 0,
      cleanedSummaries: 0,
      errors: [] as string[],
    };

    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      const expiredUsers = await pgDb
        .select()
        .from(UserTable)
        .where(
          and(
            lte(UserTable.planExpiresAt, now),
            eq(UserTable.planStatus, "active")
          )
        );

      for (const user of expiredUsers) {
        await pgDb
          .update(UserTable)
          .set({
            plan: "free",
            planStatus: "expired",
            updatedAt: now,
          })
          .where(eq(UserTable.id, user.id));

        results.expiredPlans++;
        logger.info(`Downgraded user ${user.email} to free plan (expired)`);
      }

      try {
        const deletedImages = await pgDb
          .delete(ImageGenerationTable)
          .where(
            and(
              lte(ImageGenerationTable.createdAt, thirtyDaysAgo),
              eq(ImageGenerationTable.status, "failed")
            )
          );
        
        results.deletedOldImages = deletedImages.rowCount || 0;
        logger.info(`Deleted ${results.deletedOldImages} old failed images`);
      } catch (imageError) {
        logger.warn("Image cleanup skipped (table may not exist yet)", imageError);
      }

      try {
        const deletedSummaries = await pgDb
          .delete(DailyUsageSummaryTable)
          .where(lte(DailyUsageSummaryTable.date, ninetyDaysAgo));
        
        results.cleanedSummaries = deletedSummaries.rowCount || 0;
        logger.info(`Deleted ${results.cleanedSummaries} old usage summaries`);
      } catch (summaryError) {
        logger.warn("Summary cleanup skipped (table may not exist yet)", summaryError);
      }

      results.downgradedUsers = results.expiredPlans;

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      results.errors.push(errorMsg);
      logger.error("Error during usage limits reset:", error);
    }

    logger.info("Usage limits reset completed", results);

    return NextResponse.json({
      success: true,
      message: "Usage limits reset completed",
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error in reset-usage-limits cron job:", error);
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
