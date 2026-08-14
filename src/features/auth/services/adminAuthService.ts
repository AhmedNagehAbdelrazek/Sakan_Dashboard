import { tokenHolder } from "@/lib/api/token";

export const adminAuthService = {
  login: async (email: string, password: string) => {
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

    return data;
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      tokenHolder.clear();
    }

    // const response = await fetch("/api/auth/admin/logout", {
    //   method: "POST",
    // });

    // if (!response.ok) {
    //   throw new Error("Logout failed");
    // }
  },
};
