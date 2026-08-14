import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_LOGIN_ROUTE } from "./constants";

export function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.has("access_token");
}

export function isAuthPage(pathname: string): boolean {
  return pathname.startsWith("/login");
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

export function isAdminLoginRoute(pathname: string): boolean {
  return pathname === ADMIN_LOGIN_ROUTE || pathname.startsWith(`${ADMIN_LOGIN_ROUTE}/`);
}

export function isAuthenticatedAdmin(request: NextRequest): boolean {
  return request.cookies.has(ADMIN_COOKIE_NAME);
}
