import { pgDb } from "@/lib/db/pg/db.pg";
import { UserTable, SubscriptionPlanTable } from "@/lib/db/pg/schema.pg";
import { eq } from "drizzle-orm";

const planMapping: Record<string, string> = {
  free: "free",
  basic: "basic",
  pro: "pro",
  enterprise: "enterprise",
};

async function migratePlans() {
  console.log("⏳ Starting plan migration...");

  try {
    const plans = await pgDb.select().from(SubscriptionPlanTable).execute();

    if (plans.length === 0) {
      console.log("❌ No plans found. Run seed-plans first!");
      process.exit(1);
    }

    const planIdMap: Record<string, string> = {};
    for (const plan of plans) {
      planIdMap[plan.slug] = plan.id;
      console.log(`📦 Found plan: ${plan.name} (${plan.slug}) -> ${plan.id}`);
    }

    const users = await pgDb.select().from(UserTable).execute();
    console.log(`\n👥 Found ${users.length} users to migrate`);

    let migrated = 0;
    for (const user of users) {
      const planSlug = planMapping[user.plan];
      const planId = planIdMap[planSlug];

      if (!planId) {
        console.log(
          `⚠️  User ${user.email}: No matching plan for "${user.plan}"`,
        );
        continue;
      }

      await pgDb
        .update(UserTable)
        .set({ planId })
        .where(eq(UserTable.id, user.id))
        .execute();

      migrated++;
      console.log(
        `✅ User ${user.email}: ${user.plan} -> ${planSlug} (${planId})`,
      );
    }

    console.log(
      `\n🎉 Migration complete! Migrated ${migrated}/${users.length} users`,
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migratePlans();
