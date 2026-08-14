import { request } from "@/lib/api/Request";
import type { AuthResponse, LoginDto } from "../types/auth.types";

export const authService = {
  login: (credentials: LoginDto) =>
    request.post<AuthResponse>("/admin/auth/login", credentials),

  logout: () => request.post<void>("/admin/auth/logout"),

  refresh: () => request.post<AuthResponse>("/admin/auth/refresh"),

  forgotPassword: (email: string) =>
    request.post<{ message: string }>("/admin/auth/forgot-password", { email }),
};
