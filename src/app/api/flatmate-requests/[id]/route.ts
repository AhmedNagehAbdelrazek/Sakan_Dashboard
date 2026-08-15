import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxyErrorResponse, proxyGet } from "@/lib/api/proxy";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await proxyGet<unknown>(req, `/api/flatmate-requests/${id}`);
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    return proxyErrorResponse(error);
  }
}
