import { normalizeList, type NormalizedList } from "@/lib/api/normalize";
import type { Activity } from "../types/activity.types";

async function unwrap<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { status: string; data?: T; message?: string };
  if (!response.ok || payload.status !== "success") {
    throw new Error(payload.message ?? "Request failed");
  }
  return payload.data as T;
}

export const activityService = {
  listActivities: async (): Promise<NormalizedList<Activity>> => {
    const response = await fetch("/api/activities");
    const data = await unwrap<unknown>(response);
    return normalizeList<Activity>(data);
  },

  getActivity: async (id: string): Promise<Activity> => {
    const response = await fetch(`/api/activities/${id}`);
    return unwrap<Activity>(response);
  },
};
