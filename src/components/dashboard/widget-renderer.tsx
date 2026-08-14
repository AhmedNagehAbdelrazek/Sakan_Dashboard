"use client";

import type { WidgetDateRange } from "@/features/dashboard/hooks/use-widget-data";
import type { DashboardWidgetConfig } from "@/features/dashboard/schemas/widget-config.schema";
import { BreakdownCard } from "./breakdown-card";
import { ChartCard } from "./chart-card";
import { RankedList } from "./ranked-list";
import { StatCard } from "./stat-card";

interface WidgetRendererProps {
  config: DashboardWidgetConfig;
  range: WidgetDateRange;
}

export function WidgetRenderer({ config, range }: WidgetRendererProps) {
  switch (config.type) {
    case "stat-card":
      return <StatCard config={config} range={range} />;
    case "chart":
      return <ChartCard config={config} range={range} />;
    case "ranked-list":
      return <RankedList config={config} range={range} />;
    case "breakdown":
      return <BreakdownCard config={config} range={range} />;
    default:
      return null;
  }
}
