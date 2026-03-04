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
      logger.warn("Unauthorized performance monitor attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting performance monitoring...");

    const metrics = {
      timestamp: new Date().toISOString(),
      database: { avgQueryTime: 0, slowQueries: 0, activeConnections: 0 },
      memory: { used: 0, percentage: 0 },
      activeUsers: 0,
      errors: [] as string[],
    };

    try {
      const { pgDb } = await import("lib/db/pg/db.pg");
      const { UserTable, ChatThreadTable } = await import("lib/db/pg/schema.pg");
      const { sql, gte } = await import("drizzle-orm");

      const dbStart = Date.now();
      
      const [userCount] = await pgDb
        .select({ count: sql<number>`count(*)::int` })
        .from(UserTable);
      
      const queryTime = Date.now() - dbStart;
      metrics.database.avgQueryTime = queryTime;
      metrics.database.slowQueries = queryTime > 1000 ? 1 : 0;

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [activeThreads] = await pgDb
        .select({ count: sql<number>`count(*)::int` })
        .from(ChatThreadTable)
        .where(gte(ChatThreadTable.createdAt, oneDayAgo));

      metrics.activeUsers = activeThreads?.count || 0;

      if (queryTime > 2000) {
        metrics.errors.push(`Slow database query detected: ${queryTime}ms`);
        logger.warn(`Slow query detected: ${queryTime}ms`);
      }
    } catch (dbError) {
      const errorMsg = dbError instanceof Error ? dbError.message : "Database error";
      metrics.errors.push(errorMsg);
      logger.error("Database monitoring error:", dbError);
    }

    if (process.memoryUsage) {
      const memUsage = process.memoryUsage();
      const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
      const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
      metrics.memory.used = heapUsedMB;
      metrics.memory.percentage = Math.round((heapUsedMB / heapTotalMB) * 100);
      
      if (metrics.memory.percentage > 85) {
        metrics.errors.push(`High memory usage: ${metrics.memory.percentage}%`);
        logger.warn(`High memory usage detected: ${metrics.memory.percentage}%`);
      }
    }

    const performanceStatus = metrics.errors.length === 0 ? "optimal" : "degraded";

    logger.info("Performance monitoring completed", {
      status: performanceStatus,
      metrics,
    });

    return NextResponse.json({
      success: true,
      status: performanceStatus,
      metrics,
      warnings: metrics.errors,
    });
  } catch (error) {
    logger.error("Error in performance-monitor cron job:", error);
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
