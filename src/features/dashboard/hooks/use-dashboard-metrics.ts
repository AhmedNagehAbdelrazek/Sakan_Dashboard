"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardMetrics } from "../services/dashboardService";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getDashboardMetrics,
    retry: 1,
  });
}
