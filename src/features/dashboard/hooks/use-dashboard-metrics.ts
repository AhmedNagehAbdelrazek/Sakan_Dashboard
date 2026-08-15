"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../services/dashboardService";

export interface DashboardMetricsParams {
  from: string;
  to: string;
  limit?: number;
}

export function useDashboardMetrics({ from, to, limit }: DashboardMetricsParams) {
  const params = new URLSearchParams({ from, to });
  if (limit !== undefined) {
    params.set("limit", String(limit));
  }
  const url = `/api/admin/dashboard?${params.toString()}`;

  return useQuery({
    queryKey: ["admin", "dashboard", url],
    queryFn: () => getDashboardMetrics(url),
    retry: 1,
  });
}
