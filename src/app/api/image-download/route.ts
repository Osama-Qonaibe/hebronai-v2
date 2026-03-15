import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  const filename = request.nextUrl.searchParams.get("filename") || "image.png";

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  const allowedHost = process.env.NEXT_PUBLIC_STORAGE_URL || "images.hebronai.net";
  let parsedHost: string;
  try {
    parsedHost = new URL(url).hostname;
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!parsedHost.endsWith(allowedHost) && parsedHost !== allowedHost) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const response = await fetch(url);
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }

  const contentType = response.headers.get("content-type") || "image/png";
  const buffer = await response.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
