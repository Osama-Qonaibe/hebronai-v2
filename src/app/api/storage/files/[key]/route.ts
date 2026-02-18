import { serverFileStorage } from "@/lib/file-storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { key: string } },
) {
  try {
    const key = params.key;
    const download = req.nextUrl.searchParams.get("download") === "true";
    const filename = req.nextUrl.searchParams.get("filename") || "file";

    const [buffer, metadata] = await Promise.all([
      serverFileStorage.download(key),
      serverFileStorage.getMetadata(key),
    ]);

    if (!buffer || !metadata) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const headers: HeadersInit = {
      "Content-Type": metadata.contentType,
      "Content-Length": buffer.length.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    if (download) {
      headers["Content-Disposition"] = `attachment; filename="${filename}"`;
    } else {
      headers["Content-Disposition"] = `inline; filename="${metadata.filename}"`;
    }

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file" },
      { status: 500 },
    );
  }
}
