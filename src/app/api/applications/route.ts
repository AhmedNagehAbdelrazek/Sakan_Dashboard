import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxyErrorResponse, proxyGet } from "@/lib/api/proxy";

export async function GET(req: NextRequest) {
  try {
    const data = await proxyGet<unknown>(req, "/api/applications");
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    return proxyErrorResponse(error);
  }
}
