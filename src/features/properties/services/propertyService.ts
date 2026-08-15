import { normalizeList, type NormalizedList } from "@/lib/api/normalize";
import type { Property, PropertyActionResult, PropertyState } from "../types/property.types";

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { status: string; data?: T; message?: string };
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data as T;
}

export const propertyService = {
  listProperties: async (
    state?: PropertyState | "all",
  ): Promise<NormalizedList<Property>> => {
    const query = state && state !== "all" ? `?state=${encodeURIComponent(state)}` : "";
    const response = await fetch(`/api/properties${query}`);
    const data = await unwrap<unknown>(response);
    return normalizeList<Property>(data);
  },

  getProperty: async (id: string): Promise<Property> => {
    const response = await fetch(`/api/properties/${id}`);
    return unwrap<Property>(response);
  },

  approveProperty: async (id: string): Promise<PropertyActionResult> => {
    const response = await fetch(`/api/properties/${id}/approve`, { method: "PATCH" });
    return unwrap<PropertyActionResult>(response);
  },

  declineProperty: async (id: string, reason?: string): Promise<PropertyActionResult> => {
    const body = reason ? { reason } : {};
    const response = await fetch(`/api/properties/${id}/decline`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return unwrap<PropertyActionResult>(response);
  },

  reopenProperty: async (id: string): Promise<PropertyActionResult> => {
    const response = await fetch(`/api/properties/${id}/reopen`, { method: "PATCH" });
    return unwrap<PropertyActionResult>(response);
  },
};
