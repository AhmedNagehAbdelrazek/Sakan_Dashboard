import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(_request: NextRequest) {
  try {
    const response = NextResponse.json({
      data: { message: "Session refreshed" },
    });

    response.cookies.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: { code: "REFRESH_FAILED", message: "Failed to refresh session" } },
      { status: 401 },
    );
  }
}
