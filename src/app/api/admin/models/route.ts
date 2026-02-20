import { NextResponse } from "next/server";
import { customModelProvider } from "@/lib/ai/models";
import { hasAdminPermission } from "@/lib/auth/permissions";

export async function GET() {
  try {
    const hasPermission = await hasAdminPermission();
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const modelsData = customModelProvider.modelsInfo
      .filter((provider) => provider.hasAPIKey)
      .flatMap((provider) =>
        provider.models.map((model) => ({
          value: `${provider.provider}:${model.name}`,
          label: `${model.name} (${provider.provider})`,
          provider: provider.provider,
          modelName: model.name,
          isToolCallUnsupported: model.isToolCallUnsupported,
          isImageInputUnsupported: model.isImageInputUnsupported,
          supportedFileMimeTypes: model.supportedFileMimeTypes,
        }))
      )
      .sort((a, b) => a.label.localeCompare(b.label));

    return NextResponse.json({ models: modelsData });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}
