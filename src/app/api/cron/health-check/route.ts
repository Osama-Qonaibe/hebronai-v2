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
      logger.warn("Unauthorized health check attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting health check...");

    const healthStatus = {
      timestamp: new Date().toISOString(),
      status: "healthy",
      checks: {} as Record<string, { status: string; responseTime?: number; error?: string }>,
    };

    const startTime = Date.now();

    try {
      const { pgDb } = await import("lib/db/pg/db.pg");
      const { sql } = await import("drizzle-orm");
      
      const dbStart = Date.now();
      await pgDb.execute(sql`SELECT 1`);
      const dbTime = Date.now() - dbStart;
      
      healthStatus.checks.database = {
        status: dbTime < 1000 ? "healthy" : "slow",
        responseTime: dbTime,
      };
    } catch (dbError) {
      healthStatus.checks.database = {
        status: "unhealthy",
        error: dbError instanceof Error ? dbError.message : "Unknown error",
      };
      healthStatus.status = "degraded";
    }

    try {
      const redis = (await import("@/lib/redis")).default;
      const redisStart = Date.now();
      await redis.ping();
      const redisTime = Date.now() - redisStart;
      
      healthStatus.checks.redis = {
        status: redisTime < 500 ? "healthy" : "slow",
        responseTime: redisTime,
      };
    } catch (redisError) {
      healthStatus.checks.redis = {
        status: "unavailable",
        error: redisError instanceof Error ? redisError.message : "Unknown error",
      };
    }

    const totalTime = Date.now() - startTime;
    healthStatus.checks.overall = {
      status: healthStatus.status,
      responseTime: totalTime,
    };

    if (healthStatus.status === "degraded" || healthStatus.status === "unhealthy") {
      logger.error("Health check failed:", healthStatus);
    } else {
      logger.info("Health check passed", { totalTime });
    }

    return NextResponse.json({
      success: true,
      health: healthStatus,
    });
  } catch (error) {
    logger.error("Error in health-check cron job:", error);
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
