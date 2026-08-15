import { normalizeList, type NormalizedList } from "@/lib/api/normalize";
import type { PropertyRequest, PropertyRequestStatus } from "../types/propertyRequest.types";

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { status: string; data?: T; message?: string };
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data as T;
}

export const propertyRequestService = {
  listPropertyRequests: async (): Promise<NormalizedList<PropertyRequest>> => {
    const response = await fetch("/api/property-requests");
    const data = await unwrap<unknown>(response);
    return normalizeList<PropertyRequest>(data);
  },

  getPropertyRequest: async (id: string): Promise<PropertyRequest> => {
    const response = await fetch(`/api/property-requests/${id}`);
    return unwrap<PropertyRequest>(response);
  },

  updatePropertyRequestStatus: async (
    id: string,
    status: PropertyRequestStatus,
  ): Promise<PropertyRequest> => {
    const response = await fetch(`/api/property-requests/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return unwrap<PropertyRequest>(response);
  },
};
