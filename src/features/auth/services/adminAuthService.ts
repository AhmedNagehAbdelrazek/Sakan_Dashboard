import { tokenHolder } from "@/lib/api/token";
import type { AdminLoginResponse } from "../types/auth.types";

export const adminAuthService = {
  login: async (email: string, password: string): Promise<AdminLoginResponse> => {
    const response = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.token && typeof window !== "undefined") {
      tokenHolder.set(data.token);
    }

    return data as AdminLoginResponse;
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      tokenHolder.clear();
    }

    const response = await fetch("/api/auth/admin/logout", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },
};
