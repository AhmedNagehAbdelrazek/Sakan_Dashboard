"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWidget } from "../services/dashboardService";

export interface WidgetDateRange {
  from: string;
  to: string;
}

interface UseWidgetDataOptions {
  limit?: number;
}

function substituteTemplates(
  source: string,
  range: WidgetDateRange,
  limit?: number,
): string {
  return source
    .replace("{from}", encodeURIComponent(range.from))
    .replace("{to}", encodeURIComponent(range.to))
    .replace("{limit}", limit !== undefined ? String(limit) : "");
}

export function useWidgetData(
  source: string,
  range: WidgetDateRange,
  options: UseWidgetDataOptions = {},
) {
  const url = substituteTemplates(source, range, options.limit);

  return useQuery({
    queryKey: ["widget", url],
    queryFn: () => fetchWidget(url),
    retry: 1,
  });
}
