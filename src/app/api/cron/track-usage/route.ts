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
      logger.warn("Unauthorized track usage attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    logger.info("Starting daily usage tracking...");

    const { pgDb } = await import("lib/db/pg/db.pg");
    const { UsageTable, ChatMessageTable, ImageGenerationTable, UserTable } =
      await import("lib/db/pg/schema.pg");
    const { sql, and, gte, lt, eq } = await import("drizzle-orm");

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);

    const results = {
      date: yesterday.toISOString().split("T")[0],
      chatUsageRecords: 0,
      imageUsageRecords: 0,
      totalMessages: 0,
      totalImages: 0,
      errors: [] as string[],
    };

    try {
      const chatUsageData = await pgDb
        .select({
          userId: ChatMessageTable.threadId,
          totalMessages: sql<number>`COUNT(*)`
            .mapWith(Number)
            .as("total_messages"),
          userIdActual: sql<string>`(
            SELECT user_id FROM chat_thread WHERE id = ${ChatMessageTable.threadId} LIMIT 1
          )`
            .mapWith(String)
            .as("user_id_actual"),
        })
        .from(ChatMessageTable)
        .where(
          and(
            gte(ChatMessageTable.createdAt, yesterday),
            lt(ChatMessageTable.createdAt, today),
          ),
        )
        .groupBy(ChatMessageTable.threadId);

      const chatUsageRecords = chatUsageData
        .filter((data) => data.userIdActual)
        .map((data) => ({
          userId: data.userIdActual,
          resourceType: "api_calls" as const,
          amount: data.totalMessages.toString(),
          metadata: {
            type: "chat_messages",
            date: yesterday.toISOString(),
          },
          periodStart: yesterday,
          periodEnd: today,
        }));

      if (chatUsageRecords.length > 0) {
        await pgDb.insert(UsageTable).values(chatUsageRecords);
        results.chatUsageRecords = chatUsageRecords.length;
        results.totalMessages = chatUsageRecords.reduce(
          (sum, r) => sum + Number(r.amount),
          0,
        );
      }

      logger.info(
        `Tracked chat usage: ${results.chatUsageRecords} users, ${results.totalMessages} messages`,
      );
    } catch (chatError) {
      const errorMsg = `Chat tracking error: ${
        chatError instanceof Error ? chatError.message : "Unknown"
      }`;
      results.errors.push(errorMsg);
      logger.error(errorMsg, chatError);
    }

    try {
      const imageUsageData = await pgDb
        .select({
          userId: ImageGenerationTable.userId,
          totalImages: sql<number>`COUNT(*)`
            .mapWith(Number)
            .as("total_images"),
        })
        .from(ImageGenerationTable)
        .where(
          and(
            gte(ImageGenerationTable.createdAt, yesterday),
            lt(ImageGenerationTable.createdAt, today),
            eq(ImageGenerationTable.status, "completed"),
          ),
        )
        .groupBy(ImageGenerationTable.userId);

      const imageUsageRecords = imageUsageData.map((data) => ({
        userId: data.userId,
        resourceType: "images" as const,
        amount: data.totalImages.toString(),
        metadata: {
          type: "image_generation",
          date: yesterday.toISOString(),
        },
        periodStart: yesterday,
        periodEnd: today,
      }));

      if (imageUsageRecords.length > 0) {
        await pgDb.insert(UsageTable).values(imageUsageRecords);
        results.imageUsageRecords = imageUsageRecords.length;
        results.totalImages = imageUsageRecords.reduce(
          (sum, r) => sum + Number(r.amount),
          0,
        );
      }

      logger.info(
        `Tracked image usage: ${results.imageUsageRecords} users, ${results.totalImages} images`,
      );
    } catch (imageError) {
      const errorMsg = `Image tracking error: ${
        imageError instanceof Error ? imageError.message : "Unknown"
      }`;
      results.errors.push(errorMsg);
      logger.error(errorMsg, imageError);
    }

    logger.info("Daily usage tracking completed", results);

    return NextResponse.json({
      success: true,
      message: "Daily usage tracking completed",
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Error in track-usage cron job:", error);
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
