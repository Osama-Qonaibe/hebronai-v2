import { db } from "../pg/db.pg";
import { PlanTable } from "../pg/schema.pg";

export async function seedPlans() {
  const plans = [
    {
      name: "Free",
      slug: "free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: "USD",
      features: {
        maxChatsPerMonth: 50,
        maxAgents: 3,
        maxWorkflows: 2,
        maxMcpServers: 2,
        maxFileUploadSizeMB: 10,
        customBranding: false,
        prioritySupport: false,
        apiAccess: false,
        webhooks: false,
        advancedAnalytics: false,
        customDomain: false,
      },
      description: "Perfect for getting started",
      icon: "🆓",
      color: "gray",
      isActive: true,
      isPublic: true,
      sortOrder: 1,
    },
    {
      name: "Starter",
      slug: "starter",
      monthlyPrice: 9,
      yearlyPrice: 90,
      currency: "USD",
      features: {
        maxChatsPerMonth: 500,
        maxAgents: 10,
        maxWorkflows: 10,
        maxMcpServers: 5,
        maxFileUploadSizeMB: 50,
        customBranding: false,
        prioritySupport: false,
        apiAccess: true,
        webhooks: false,
        advancedAnalytics: true,
        customDomain: false,
      },
      description: "For growing teams and projects",
      icon: "🚀",
      badge: "Most Popular",
      color: "blue",
      isActive: true,
      isPublic: true,
      sortOrder: 2,
    },
    {
      name: "Pro",
      slug: "pro",
      monthlyPrice: 29,
      yearlyPrice: 290,
      currency: "USD",
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
        customDomain: false,
      },
      description: "For professionals and small businesses",
      icon: "⭐",
      badge: "Best Value",
      color: "purple",
      isActive: true,
      isPublic: true,
      sortOrder: 3,
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      monthlyPrice: 99,
      yearlyPrice: 990,
      currency: "USD",
      features: {
        maxChatsPerMonth: "unlimited",
        maxAgents: "unlimited",
        maxWorkflows: "unlimited",
        maxMcpServers: "unlimited",
        maxFileUploadSizeMB: 5000,
        customBranding: true,
        prioritySupport: true,
        apiAccess: true,
        webhooks: true,
        advancedAnalytics: true,
        customDomain: true,
      },
      description: "For large organizations with dedicated support",
      icon: "🏢",
      color: "orange",
      isActive: true,
      isPublic: true,
      sortOrder: 4,
    },
  ];

  try {
    await db.insert(PlanTable).values(plans).onConflictDoNothing();
    console.log("✅ Plans seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
    throw error;
  }
}

if (require.main === module) {
  seedPlans()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}