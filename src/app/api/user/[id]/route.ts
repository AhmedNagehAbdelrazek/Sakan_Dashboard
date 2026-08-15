import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxyErrorResponse, proxyGet, proxyPatch } from "@/lib/api/proxy";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await proxyGet<unknown>(req, `/api/user/${id}`);
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    return proxyErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const data = await proxyPatch<unknown>(req, `/api/user/${id}`, body);
    return NextResponse.json({ status: "success", data });
  } catch (error) {
    return proxyErrorResponse(error);
  }
}
