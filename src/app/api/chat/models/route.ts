import { customModelProvider } from "lib/ai/models";
import { getSession } from "auth/server";
import { getUserSubscription } from "lib/auth/subscription";
import { getAccessibleModels } from "lib/subscription/model-access";

export const GET = async () => {
  try {
    const session = await getSession();

    // If not logged in, return all models (for public view)
    if (!session?.user?.id) {
      return Response.json(
        customModelProvider.modelsInfo.sort((a, b) => {
          if (a.hasAPIKey && !b.hasAPIKey) return -1;
          if (!a.hasAPIKey && b.hasAPIKey) return 1;
          return 0;
        }),
      );
    }

    // Get user subscription
    const subscription = await getUserSubscription();

    if (!subscription) {
      return Response.json({ error: "No subscription found" }, { status: 404 });
    }

    // Get accessible models for user's plan
    const accessibleModels = getAccessibleModels(subscription.plan);

    // Create a set of accessible model keys for quick lookup
    const accessibleModelKeys = new Set<string>();
    accessibleModels.forEach((rule) => {
      rule.models.forEach((model) => {
        accessibleModelKeys.add(`${rule.provider}:${model}`);
      });
    });

    // Filter models based on user's plan
    const filteredModels = customModelProvider.modelsInfo
      .map((provider) => ({
        ...provider,
        models: provider.models.filter((model) => {
          const key = `${provider.provider}:${model.name}`;
          return accessibleModelKeys.has(key);
        }),
      }))
      .filter((provider) => provider.models.length > 0)
      .sort((a, b) => {
        if (a.hasAPIKey && !b.hasAPIKey) return -1;
        if (!a.hasAPIKey && b.hasAPIKey) return 1;
        return 0;
      });

    return Response.json({
      plan: subscription.plan,
      isActive: subscription.isActive,
      models: filteredModels,
      totalModels: filteredModels.reduce((sum, p) => sum + p.models.length, 0),
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
