import { NextResponse } from "next/server";
import { customModelProvider } from "@/lib/ai/models";
import { getServerSession } from "@/lib/auth/server-utils";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
