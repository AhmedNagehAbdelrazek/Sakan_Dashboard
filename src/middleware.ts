import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_LOGIN_ROUTE } from "@/lib/auth/constants";
import {
  isAdminLoginRoute,
  isAdminRoute,
  isAuthenticatedAdmin,
} from "@/lib/auth/middleware";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    const hasAdminToken = request.cookies.has(ADMIN_COOKIE_NAME);
    return NextResponse.redirect(
      new URL(hasAdminToken ? "/admin" : "/login", request.url),
    );
  }

  if (isAdminRoute(pathname)) {
    const hasAdminToken = isAuthenticatedAdmin(request);

    if (hasAdminToken && isAdminLoginRoute(pathname)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    if (!hasAdminToken && !isAdminLoginRoute(pathname)) {
      const loginUrl = new URL(ADMIN_LOGIN_ROUTE, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)"],
};
