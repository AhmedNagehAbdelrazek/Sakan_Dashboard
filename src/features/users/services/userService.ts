import { normalizeList, type NormalizedList } from "@/lib/api/normalize";
import type { UpdateUserInput, User } from "../types/user.types";

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { status: string; data?: T; message?: string };
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data as T;
}

export const userService = {
  listUsers: async (): Promise<NormalizedList<User>> => {
    const response = await fetch("/api/user");
    const data = await unwrap<unknown>(response);
    return normalizeList<User>(data);
  },

  getUser: async (id: string): Promise<User> => {
    const response = await fetch(`/api/user/${id}`);
    return unwrap<User>(response);
  },

  updateUser: async (id: string, input: UpdateUserInput): Promise<User> => {
    const response = await fetch(`/api/user/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return unwrap<User>(response);
  },
};
