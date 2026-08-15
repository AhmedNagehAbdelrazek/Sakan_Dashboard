import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { request } from "@/lib/api/Request";
import { getAuthHeaders } from "@/lib/api/withAuth";

function buildUrl(path: string, req: NextRequest): string {
  const query = req.nextUrl.searchParams.toString();
  return query ? `${path}?${query}` : path;
}

export async function proxyGet<T>(req: NextRequest, path: string): Promise<T> {
  return request.get<T>(buildUrl(path, req), { headers: getAuthHeaders(req) });
}

export async function proxyPatch<T>(req: NextRequest, path: string, body?: unknown): Promise<T> {
  return request.patch<T>(path, body ?? {}, { headers: getAuthHeaders(req) });
}

export async function proxyPost<T>(req: NextRequest, path: string, body?: unknown): Promise<T> {
  return request.post<T>(path, body ?? {}, { headers: getAuthHeaders(req) });
}

export function proxyErrorResponse(error: unknown): NextResponse {
  const axiosError = axios.isAxiosError(error) ? error : null;
  const status = axiosError?.response?.status ?? 500;
  const message =
    (axiosError?.response?.data as { message?: string } | undefined)?.message ??
    "Something went wrong. Please try again later.";
  return NextResponse.json({ status: "error", message }, { status });
}
