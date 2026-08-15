import { normalizeList, type NormalizedList } from "@/lib/api/normalize";
import type {
  Application,
  ApplicationDetail,
  RejectApplicationInput,
} from "../types/application.types";

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { status: string; data?: T; message?: string };
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data as T;
}

export const applicationService = {
  listApplications: async (): Promise<NormalizedList<Application>> => {
    const response = await fetch("/api/applications");
    const data = await unwrap<unknown>(response);
    return normalizeList<Application>(data);
  },

  getApplication: async (id: string): Promise<ApplicationDetail> => {
    const response = await fetch(`/api/applications/${id}`);
    return unwrap<ApplicationDetail>(response);
  },

  approveApplication: async (id: string): Promise<ApplicationDetail> => {
    const response = await fetch(`/api/applications/${id}/approve`, { method: "PATCH" });
    return unwrap<ApplicationDetail>(response);
  },

  rejectApplication: async (
    id: string,
    input: RejectApplicationInput,
  ): Promise<ApplicationDetail> => {
    const response = await fetch(`/api/applications/${id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return unwrap<ApplicationDetail>(response);
  },

  completeApplication: async (id: string): Promise<ApplicationDetail> => {
    const response = await fetch(`/api/applications/${id}/complete`, { method: "PATCH" });
    return unwrap<ApplicationDetail>(response);
  },
};
