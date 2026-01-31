import { pgDb as db } from "@/lib/db/pg/db.pg";
import { PlanTable } from "@/lib/db/pg/schema.pg";
import { consola } from "consola";
import { eq } from "drizzle-orm";

const PLANS = [
  {
    slug: "free",
    name: "Free",
    description: "Perfect for trying out HebronAI",
    monthlyPriceUsd: 0,
    yearlyPriceUsd: 0,
    features: {
      maxChatsPerMonth: 50,
      maxAgents: 3,
      maxWorkflows: 2,
      maxMcpServers: 1,
      maxFileUploadSizeMB: 10,
      customBranding: false,
      prioritySupport: false,
      apiAccess: false,
      webhooks: false,
      advancedAnalytics: false,
      customDomain: false,
    },
    isActive: true,
  },
  {
    slug: "pro",
    name: "Pro",
    description: "For power users and small teams",
    monthlyPriceUsd: 20,
    yearlyPriceUsd: 200,
    features: {
      maxChatsPerMonth: "unlimited",
      maxAgents: "unlimited",
      maxWorkflows: "unlimited",
      maxMcpServers: 10,
      maxFileUploadSizeMB: 100,
      customBranding: false,
      prioritySupport: true,
      apiAccess: true,
      webhooks: true,
      advancedAnalytics: false,
      customDomain: false,
    },
    isActive: true,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    monthlyPriceUsd: 100,
    yearlyPriceUsd: 1000,
    features: {
      maxChatsPerMonth: "unlimited",
      maxAgents: "unlimited",
      maxWorkflows: "unlimited",
      maxMcpServers: "unlimited",
      maxFileUploadSizeMB: 500,
      customBranding: true,
      prioritySupport: true,
      apiAccess: true,
      webhooks: true,
      advancedAnalytics: true,
      customDomain: true,
    },
    isActive: true,
  },
  {
    slug: "lifetime",
    name: "Lifetime",
    description: "One-time payment for lifetime access",
    monthlyPriceUsd: 0,
    yearlyPriceUsd: 500,
    features: {
      maxChatsPerMonth: "unlimited",
      maxAgents: "unlimited",
      maxWorkflows: "unlimited",
      maxMcpServers: "unlimited",
      maxFileUploadSizeMB: 200,
      customBranding: true,
      prioritySupport: true,
      apiAccess: true,
      webhooks: true,
      advancedAnalytics: true,
      customDomain: false,
    },
    isActive: true,
  },
];

export async function seedPlans() {
  try {
    consola.start("Seeding plans...");

    for (const planData of PLANS) {
      const existing = await db
        .select()
        .from(PlanTable)
        .where(eq(PlanTable.slug, planData.slug))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(PlanTable).values(planData);
        consola.success(`✅ Created plan: ${planData.name}`);
      } else {
        consola.info(`ℹ️  Plan already exists: ${planData.name}`);
      }
    }

    consola.success("✅ Plans seeding completed!");
  } catch (error) {
    consola.error("❌ Failed to seed plans:", error);
    throw error;
  }
}

export async function seedPlansIfNeeded() {
  try {
    const existingPlans = await db.select().from(PlanTable).limit(1);
    
    if (existingPlans.length === 0) {
      consola.info("🌱 No plans found, seeding...");
      await seedPlans();
    } else {
      consola.success("✅ Plans already exist, skipping seed");
    }
  } catch (error) {
    consola.error("❌ Failed to check/seed plans:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPlans()
    .then(() => {
      consola.success("Done!");
      process.exit(0);
    })
    .catch((error) => {
      consola.error(error);
      process.exit(1);
    });
}
