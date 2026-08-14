"use client";

import type { WidgetDateRange } from "@/features/dashboard/hooks/use-widget-data";
import { useWidgetData } from "@/features/dashboard/hooks/use-widget-data";
import type { StatCardWidgetConfig } from "@/features/dashboard/schemas/widget-config.schema";
import { formatCurrency, formatNumber } from "@/lib/format";
import { WidgetFrame } from "./widget-frame";

interface StatCardProps {
  config: StatCardWidgetConfig;
  range: WidgetDateRange;
}

export function StatCard({ config, range }: StatCardProps) {
  const { data, isLoading, isError, refetch } = useWidgetData(
    config.source,
    range,
  );

  let value: number | null = null;

  if (typeof data === "number") {
    value = data;
  } else if (data && typeof data === "object" && !Array.isArray(data)) {
    const fieldValue = (data as Record<string, unknown>)[config.options.field];
    if (typeof fieldValue === "number") {
      value = fieldValue;
    }
  }

  const display =
    value === null
      ? ""
      : config.options.format === "currency"
        ? formatCurrency(value)
        : formatNumber(value);

  return (
    <WidgetFrame
      titleKey={config.titleKey}
      isLoading={isLoading}
      isError={isError}
      isEmpty={value === null && !isLoading && !isError}
      onRetry={refetch}
    >
      <div className="text-3xl font-bold">{display}</div>
    </WidgetFrame>
  );
}
