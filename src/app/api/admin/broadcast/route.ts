import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxyErrorResponse, proxyPost } from "@/lib/api/proxy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await proxyPost<unknown>(req, "/api/admin/broadcast", body);
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    return proxyErrorResponse(error);
  }
}
