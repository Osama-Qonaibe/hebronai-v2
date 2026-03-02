import { NextResponse } from "next/server";
import { pgDb } from "@/lib/db/pg/db.pg";
import { SubscriptionPlanTable } from "@/lib/db/pg/schema.pg";
import { sql } from "drizzle-orm";
import { PLANS } from "@/lib/subscription/plans";
import { SubscriptionPlan as StaticPlan } from "@/types/subscription";

function convertStaticPlansToSubscriptionPlans(): StaticPlan[] {
  return Object.values(PLANS).map((plan, index) => ({
    id: plan.name,
    slug: plan.name,
    name: plan.name,
    displayName: {
      en: plan.displayName,
      ar: plan.displayName === "Free" ? "مجاني" :
         plan.displayName === "Basic" ? "مبتدئين" :
         plan.displayName === "Pro" ? "محترف" : "للشركات"
    },
    description: {
      en: `${plan.displayName} Plan`,
      ar: `خطة ${plan.displayName}`
    },
    pricing: {
      monthly: plan.price,
      yearly: 0,
      currency: "USD",
      discount: 0
    },
    models: {
      allowed: ["gpt-4", "gpt-3.5-turbo"],
      default: "gpt-3.5-turbo",
      limits: {}
    },
    limits: {
      chats: {
        maxActive: plan.limits.maxAgents,
        maxPerMonth: -1
      },
      messages: {
        maxPerMonth: plan.limits.maxTokensPerMonth,
        maxPerDay: -1
      },
      files: {
        maxSize: 10,
        maxTotal: 100,
        allowedTypes: []
      },
      api: {
        rateLimit: 60,
        burstLimit: 10
      },
      images: {
        maxPerDay: plan.limits.maxImagesPerDay,
        maxPerMonth: plan.limits.maxImagesPerMonth
      }
    },
    features: {
      mcpServers: {
        enabled: plan.limits.maxMCPServers > 0,
        maxServers: plan.limits.maxMCPServers
      },
      workflows: {
        enabled: plan.limits.maxWorkflows > 0,
        maxWorkflows: plan.limits.maxWorkflows
      },
      agents: {
        enabled: true,
        maxAgents: plan.limits.maxAgents
      },
      advanced: {
        analytics: plan.name === "pro" || plan.name === "enterprise",
        apiAccess: plan.name !== "free",
        prioritySupport: plan.name === "pro" || plan.name === "enterprise",
        customBranding: plan.name === "enterprise"
      }
    },
    adminSettings: {
      isActive: true,
      isVisible: true,
      isFeatured: plan.popular || false,
      allowSignup: true,
      maxUsers: -1,
      trialDays: plan.name === "free" ? 0 : 7
    },
    metadata: {
      order: index + 1,
      badge: plan.popular ? "Popular" : undefined,
      color: undefined,
      icon: undefined
    },
    createdBy: "system",
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

export async function GET() {
  const staticPlans = convertStaticPlansToSubscriptionPlans();
  
  try {
    const adminPlans = await pgDb
      .select()
      .from(SubscriptionPlanTable)
      .where(
        sql`(admin_settings->>'isActive')::boolean = true AND (admin_settings->>'isVisible')::boolean = true`,
      )
      .orderBy(sql`(metadata->>'order')::integer`);

    return NextResponse.json({ 
      plans: [...staticPlans, ...adminPlans] 
    });
  } catch (error) {
    console.warn("Admin plans not available, using static plans only:", error);
    return NextResponse.json({ 
      plans: staticPlans 
    });
  }
}
