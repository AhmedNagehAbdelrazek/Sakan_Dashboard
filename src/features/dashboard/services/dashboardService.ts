import { apiEnvelopeSchema } from "../schemas/dashboard.schema";
import type { DashboardMetrics } from "../types/dashboard.types";

export async function fetchWidget(source: string): Promise<unknown> {
  const response = await fetch(source);
  if (!response.ok) {
    throw new Error(`Widget request failed (${response.status})`);
  }

  const payload: unknown = await response.json();
  const envelope = apiEnvelopeSchema.safeParse(payload);

  if (!envelope.success) {
    throw new Error("Invalid widget data envelope");
  }

  if (envelope.data.status !== "success") {
    throw new Error(envelope.data.message ?? "Widget request failed");
  }

  return envelope.data.data;
}

export async function getDashboardMetrics(url = "/api/admin/dashboard"): Promise<DashboardMetrics> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load dashboard metrics (${response.status})`);
  }

  const payload: unknown = await response.json();
  const envelope = apiEnvelopeSchema.safeParse(payload);

  if (!envelope.success) {
    throw new Error("Invalid dashboard data envelope");
  }

  if (envelope.data.status !== "success") {
    throw new Error(envelope.data.message ?? "Failed to load dashboard metrics");
  }

  return envelope.data.data as DashboardMetrics;
}
