import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth/constants";

export function getAuthHeaders(req: NextRequest): Record<string, string> {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
