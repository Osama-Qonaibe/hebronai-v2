import { db } from "@/database/client";
import { usage } from "@/database/schema";
import { eq, and, gte, sql } from "drizzle-orm";

const TEST_USER_ID = "test-user-123";

async function testLimits() {
  console.log("🧪 بدء اختبار الحماية...\n");

  // 1️⃣ تنظيف البيانات التجريبية
  console.log("🧹 تنظيف البيانات القديمة...");
  await db.delete(usage).where(eq(usage.userId, TEST_USER_ID));

  // 2️⃣ إضافة بيانات اختبار
  console.log("📊 إضافة بيانات اختبار...\n");

  const testData = [
    { type: "messages", amount: 95, period: "day" },
    { type: "images", amount: 8, period: "day" },
    { type: "tokens", amount: 95000, period: "month" },
    { type: "storage", amount: 95, period: "total" },
    { type: "api_calls", amount: 95, period: "day" },
    { type: "documents", amount: 18, period: "month" },
  ];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const data of testData) {
    let periodStart: Date;
    let periodEnd: Date;

    if (data.period === "day") {
      periodStart = today;
      periodEnd = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    } else if (data.period === "month") {
      periodStart = thisMonth;
      periodEnd = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1, 1);
    } else {
      periodStart = new Date(2020, 0, 1);
      periodEnd = new Date(2030, 0, 1);
    }

    await db.insert(usage).values({
      userId: TEST_USER_ID,
      resourceType: data.type as any,
      amount: data.amount,
      periodStart,
      periodEnd,
    });
  }

  // 3️⃣ عرض النتائج
  console.log("📈 نتائج الاختبار:\n");

  const results = await db
    .select({
      resourceType: usage.resourceType,
      total: sql<number>`SUM(${usage.amount})`,
    })
    .from(usage)
    .where(eq(usage.userId, TEST_USER_ID))
    .groupBy(usage.resourceType);

  const limits: Record<string, number> = {
    messages: 100,
    images: 10,
    tokens: 100000,
    storage: 100,
    api_calls: 100,
    documents: 20,
  };

  console.log("┌─────────────┬──────────┬────────┬─────────┐");
  console.log("│ Resource    │ Current  │ Limit  │ Status  │");
  console.log("├─────────────┼──────────┼────────┼─────────┤");

  for (const result of results) {
    const current = Number(result.total);
    const limit = limits[result.resourceType];
    const percentage = ((current / limit) * 100).toFixed(1);
    const status = current >= limit ? "🔴 BLOCKED" : "🟢 OK";

    console.log(
      `│ ${result.resourceType.padEnd(11)} │ ${String(current).padEnd(8)} │ ${String(limit).padEnd(6)} │ ${status.padEnd(7)} │`
    );
  }

  console.log("└─────────────┴──────────┴────────┴─────────┘\n");

  // 4️⃣ تنظيف
  console.log("🧹 تنظيف البيانات التجريبية...");
  await db.delete(usage).where(eq(usage.userId, TEST_USER_ID));

  console.log("\n✅ اكتمل الاختبار بنجاح!");
  process.exit(0);
}

testLimits().catch((error) => {
  console.error("❌ خطأ:", error);
  process.exit(1);
});
