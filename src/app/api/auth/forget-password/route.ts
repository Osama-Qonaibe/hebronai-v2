import { auth } from "@/lib/auth/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return auth.api.forgetPassword({
    body: await req.json(),
  });
}
