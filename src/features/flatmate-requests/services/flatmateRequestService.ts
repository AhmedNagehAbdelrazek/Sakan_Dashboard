import { normalizeList, type NormalizedList } from "@/lib/api/normalize";
import type { FlatmateRequest } from "../types/flatmateRequest.types";

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { status: string; data?: T; message?: string };
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data as T;
}

export const flatmateRequestService = {
  listFlatmateRequests: async (): Promise<NormalizedList<FlatmateRequest>> => {
    const response = await fetch("/api/flatmate-requests");
    const data = await unwrap<unknown>(response);
    return normalizeList<FlatmateRequest>(data);
  },

  getFlatmateRequest: async (id: string): Promise<FlatmateRequest> => {
    const response = await fetch(`/api/flatmate-requests/${id}`);
    return unwrap<FlatmateRequest>(response);
  },
};
