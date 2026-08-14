import { NextResponse } from "next/server";
import { request } from "@/lib/api/Request";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const response = await request.post<{
      data: { token: string; user: { id: string; email: string; name: string; role: string } };
      status: string;
    }>("/admin/auth/login", { email, password });
    
    const { token, user } = response.data;
    const nextResponse = NextResponse.json({ user, token });

    nextResponse.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return nextResponse;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response: { status: number; data: { message?: string } };
      };
      return NextResponse.json(
        { message: axiosError.response.data?.message || "Invalid email or password" },
        { status: axiosError.response.status },
      );
    }

    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
