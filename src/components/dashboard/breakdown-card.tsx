"use client";

import type { WidgetDateRange } from "@/features/dashboard/hooks/use-widget-data";
import { useWidgetData } from "@/features/dashboard/hooks/use-widget-data";
import type { BreakdownWidgetConfig } from "@/features/dashboard/schemas/widget-config.schema";
import type { WidgetRecord } from "@/features/dashboard/types/dashboard.types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { WidgetFrame } from "./widget-frame";

interface BreakdownCardProps {
  config: BreakdownWidgetConfig;
  range: WidgetDateRange;
}

export function BreakdownCard({ config, range }: BreakdownCardProps) {
  const { data, isLoading, isError, refetch } = useWidgetData(
    config.source,
    range,
  );
  const rows: WidgetRecord[] = Array.isArray(data)
    ? (data as WidgetRecord[])
    : [];
  const { labelField, valueField, format } = config.options;

  const total = rows.reduce(
    (sum, row) =>
      sum +
      (typeof row[valueField] === "number"
        ? (row[valueField] as number)
        : Number(row[valueField] ?? 0)),
    0,
  );

  return (
    <WidgetFrame
      titleKey={config.titleKey}
      isLoading={isLoading}
      isError={isError}
      isEmpty={rows.length === 0}
      onRetry={refetch}
    >
      <div className="space-y-4">
        {rows.map((row, index) => {
          const num =
            typeof row[valueField] === "number"
              ? (row[valueField] as number)
              : Number(row[valueField] ?? 0);
          const pct = total > 0 ? (num / total) * 100 : 0;
          return (
            <div key={`${row[labelField]}-${index}`}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{row[labelField]}</span>
                <span className="font-medium">
                  {format === "currency" ? formatCurrency(num) : formatNumber(num)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </WidgetFrame>
  );
}
