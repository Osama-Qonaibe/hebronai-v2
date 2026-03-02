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
      discount: {
        yearly: 0
      }
    },
    models: {
      allowed: ["gpt-4", "gpt-3.5-turbo"],
      default: "gpt-3.5-turbo",
      limits: {}
    },
    limits: {
      chats: {
        maxActive: plan.limits.maxAgents,
        maxHistory: 100
      },
      messages: {
        maxPerChat: -1,
        maxPerDay: -1,
        maxPerMonth: plan.limits.maxTokensPerMonth
      },
      files: {
        maxSize: 10,
        maxCount: 100,
        allowedTypes: []
      },
      api: {
        rateLimit: 60,
        burstLimit: 10
      },
      images: {
        maxPerDay: plan.limits.maxImagesPerDay,
        maxPerMonth: plan.limits.maxImagesPerMonth,
        maxResolution: "1024x1024"
      }
    },
    features: {
      mcpServers: {
        enabled: plan.limits.maxMCPServers > 0,
        maxServers: plan.limits.maxMCPServers,
        customServers: plan.name !== "free"
      },
      workflows: {
        enabled: plan.limits.maxWorkflows > 0,
        maxWorkflows: plan.limits.maxWorkflows
      },
      agents: {
        enabled: true,
        maxCustomAgents: plan.limits.maxAgents,
        shareAgents: plan.name !== "free"
      },
      advanced: {
        codeInterpreter: plan.name === "pro" || plan.name === "enterprise",
        imageGeneration: plan.limits.maxImagesPerDay > 0,
        voiceChat: false,
        documentAnalysis: plan.name !== "free",
        apiAccess: plan.name !== "free",
        prioritySupport: plan.name === "pro" || plan.name === "enterprise",
        teamWorkspace: plan.name === "enterprise",
        exportData: true
      }
    },
    adminSettings: {
      isActive: true,
      isVisible: true,
      isFeatured: plan.popular || false,
      allowSignup: true,
      maxUsers: null,
      trialDays: plan.name === "free" ? 0 : 7
    },
    metadata: {
      order: index + 1,
      badge: plan.popular ? "Popular" : undefined,
      color: "#3B82F6",
      icon: "package"
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
