import { customModelProvider } from "lib/ai/models";
import { getSession } from "auth/server";
import { getUserSubscription } from "lib/auth/subscription";
import { getAccessibleModels } from "lib/subscription/model-access";

export const GET = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return Response.json(
        customModelProvider.modelsInfo.sort((a, b) => {
          if (a.hasAPIKey && !b.hasAPIKey) return -1;
          if (!a.hasAPIKey && b.hasAPIKey) return 1;
          return 0;
        }),
      );
    }

    if (session.user.role === "admin") {
      return Response.json({
        plan: "enterprise",
        isActive: true,
        models: customModelProvider.modelsInfo.sort((a, b) => {
          if (a.hasAPIKey && !b.hasAPIKey) return -1;
          if (!a.hasAPIKey && b.hasAPIKey) return 1;
          return 0;
        }),
        totalModels: customModelProvider.modelsInfo.reduce(
          (sum, p) => sum + p.models.length,
          0,
        ),
      });
    }

    const subscription = await getUserSubscription();

    if (!subscription) {
      return Response.json({ error: "No subscription found" }, { status: 404 });
    }

    const accessibleModels = getAccessibleModels(subscription.plan);

    const accessibleModelKeys = new Set<string>();
    accessibleModels.forEach((rule) => {
      rule.models.forEach((model) => {
        accessibleModelKeys.add(`${rule.provider}:${model}`);
      });
    });

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
