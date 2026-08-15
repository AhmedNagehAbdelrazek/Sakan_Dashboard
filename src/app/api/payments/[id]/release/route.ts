import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxyErrorResponse, proxyPatch } from "@/lib/api/proxy";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await proxyPatch<unknown>(req, `/api/payments/${id}/release`, {});
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    return proxyErrorResponse(error);
  }
}
