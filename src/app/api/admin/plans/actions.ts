"use server";

import { validatedActionWithAdminPermission } from "lib/action-utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  plansRepository,
  type NewPlan,
  type UpdatePlan,
} from "@/lib/db/pg/repositories/plans.repository";
import logger from "lib/logger";

// ==================== VALIDATION SCHEMAS ====================

const PlanFeaturesSchema = z.object({
  maxChatsPerMonth: z.union([z.number(), z.literal("unlimited")]),
  maxAgents: z.union([z.number(), z.literal("unlimited")]),
  maxWorkflows: z.union([z.number(), z.literal("unlimited")]),
  maxMcpServers: z.union([z.number(), z.literal("unlimited")]),
  maxFileUploadSizeMB: z.number(),
  customBranding: z.boolean(),
  prioritySupport: z.boolean(),
  apiAccess: z.boolean(),
  webhooks: z.boolean(),
  advancedAnalytics: z.boolean(),
  customDomain: z.boolean(),
});

const CreatePlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  slug: z.string().min(1, "Plan slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  monthlyPrice: z.number().min(0, "Monthly price must be positive"),
  yearlyPrice: z.number().min(0, "Yearly price must be positive"),
  currency: z.string().default("USD"),
  features: PlanFeaturesSchema,
  description: z.string().optional(),
  icon: z.string().optional(),
  badge: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const UpdatePlanSchema = z.object({
  id: z.string().uuid("Invalid plan ID"),
  name: z.string().min(1).optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  monthlyPrice: z.number().min(0).optional(),
  yearlyPrice: z.number().min(0).optional(),
  currency: z.string().optional(),
  features: PlanFeaturesSchema.optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  badge: z.string().optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  sortOrder: z.number().optional(),
});

const DeletePlanSchema = z.object({
  id: z.string().uuid("Invalid plan ID"),
});

const TogglePlanActiveSchema = z.object({
  id: z.string().uuid("Invalid plan ID"),
  isActive: z.boolean(),
});

// ==================== ACTION TYPES ====================

type ActionState = {
  success: boolean;
  message: string;
  error?: string;
  data?: any;
};

// ==================== ADMIN ACTIONS ====================

/**
 * Create a new plan (Admin only)
 */
export const createPlanAction = validatedActionWithAdminPermission(
  CreatePlanSchema,
  async (data): Promise<ActionState> => {
    try {
      // Check if slug already exists
      const existingPlan = await plansRepository.getPlanBySlug(data.slug);
      if (existingPlan) {
        return {
          success: false,
          message: "A plan with this slug already exists",
        };
      }

      const plan = await plansRepository.createPlan(data as NewPlan);

      revalidatePath("/admin/plans");
      revalidatePath("/pricing");

      logger.info(`Plan created: ${plan.name} (${plan.slug})`);

      return {
        success: true,
        message: `Plan "${plan.name}" created successfully`,
        data: plan,
      };
    } catch (error) {
      logger.error("Failed to create plan:", error);
      return {
        success: false,
        message: "Failed to create plan",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Update an existing plan (Admin only)
 */
export const updatePlanAction = validatedActionWithAdminPermission(
  UpdatePlanSchema,
  async (data): Promise<ActionState> => {
    try {
      const { id, ...updateData } = data;

      // Check if plan exists
      const existingPlan = await plansRepository.getPlanById(id);
      if (!existingPlan) {
        return {
          success: false,
          message: "Plan not found",
        };
      }

      // If updating slug, check it's not taken
      if (updateData.slug && updateData.slug !== existingPlan.slug) {
        const planWithSlug = await plansRepository.getPlanBySlug(updateData.slug);
        if (planWithSlug) {
          return {
            success: false,
            message: "A plan with this slug already exists",
          };
        }
      }

      const updatedPlan = await plansRepository.updatePlan(id, updateData as UpdatePlan);

      revalidatePath("/admin/plans");
      revalidatePath(`/admin/plans/${id}`);
      revalidatePath("/pricing");

      logger.info(`Plan updated: ${updatedPlan?.name} (${updatedPlan?.slug})`);

      return {
        success: true,
        message: `Plan "${updatedPlan?.name}" updated successfully`,
        data: updatedPlan,
      };
    } catch (error) {
      logger.error("Failed to update plan:", error);
      return {
        success: false,
        message: "Failed to update plan",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Delete a plan (Admin only)
 * Will fail if there are active subscriptions
 */
export const deletePlanAction = validatedActionWithAdminPermission(
  DeletePlanSchema,
  async (data): Promise<ActionState> => {
    try {
      const { id } = data;

      // Check if plan exists
      const plan = await plansRepository.getPlanById(id);
      if (!plan) {
        return {
          success: false,
          message: "Plan not found",
        };
      }

      // Check if plan can be deleted (no active subscriptions)
      const canDelete = await plansRepository.canDeletePlan(id);
      if (!canDelete) {
        return {
          success: false,
          message: "Cannot delete plan with active subscriptions. Deactivate it instead.",
        };
      }

      await plansRepository.deletePlan(id);

      revalidatePath("/admin/plans");
      revalidatePath("/pricing");

      logger.info(`Plan deleted: ${plan.name} (${plan.slug})`);

      return {
        success: true,
        message: `Plan "${plan.name}" deleted successfully`,
      };
    } catch (error) {
      logger.error("Failed to delete plan:", error);
      return {
        success: false,
        message: "Failed to delete plan",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Toggle plan active status (Admin only)
 */
export const togglePlanActiveAction = validatedActionWithAdminPermission(
  TogglePlanActiveSchema,
  async (data): Promise<ActionState> => {
    try {
      const { id, isActive } = data;

      // Check if plan exists
      const plan = await plansRepository.getPlanById(id);
      if (!plan) {
        return {
          success: false,
          message: "Plan not found",
        };
      }

      const updatedPlan = await plansRepository.togglePlanActive(id, isActive);

      revalidatePath("/admin/plans");
      revalidatePath("/pricing");

      logger.info(`Plan ${isActive ? 'activated' : 'deactivated'}: ${plan.name}`);

      return {
        success: true,
        message: `Plan "${plan.name}" ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: updatedPlan,
      };
    } catch (error) {
      logger.error("Failed to toggle plan status:", error);
      return {
        success: false,
        message: "Failed to update plan status",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Get all plans (Admin only - includes inactive)
 */
export async function getAllPlansAction(): Promise<ActionState> {
  try {
    const plans = await plansRepository.getAllPlans();

    return {
      success: true,
      message: "Plans retrieved successfully",
      data: plans,
    };
  } catch (error) {
    logger.error("Failed to get plans:", error);
    return {
      success: false,
      message: "Failed to retrieve plans",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get plan with subscription count (Admin only)
 */
export async function getPlanWithStatsAction(id: string): Promise<ActionState> {
  try {
    const plan = await plansRepository.getPlanById(id);
    if (!plan) {
      return {
        success: false,
        message: "Plan not found",
      };
    }

    const subscriptions = await plansRepository.getPlanSubscriptions(id);

    return {
      success: true,
      message: "Plan retrieved successfully",
      data: {
        ...plan,
        activeSubscriptions: subscriptions.filter(s => s.status === "active").length,
        totalSubscriptions: subscriptions.length,
      },
    };
  } catch (error) {
    logger.error("Failed to get plan stats:", error);
    return {
      success: false,
      message: "Failed to retrieve plan details",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
