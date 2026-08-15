"use client";

import type { WidgetDateRange } from "@/features/dashboard/hooks/use-widget-data";
import { useWidgetData } from "@/features/dashboard/hooks/use-widget-data";
import type { BreakdownWidgetConfig } from "@/features/dashboard/schemas/widget-config.schema";
import type { WidgetRecord } from "@/features/dashboard/types/dashboard.types";
import { useTranslation } from "@/lib/i18n/client";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getByPath } from "@/lib/object";
import { WidgetFrame } from "./widget-frame";

interface BreakdownCardProps {
  config: BreakdownWidgetConfig;
  range: WidgetDateRange;
}

function toRows(target: unknown, labelField: string, valueField: string): WidgetRecord[] {
  if (Array.isArray(target)) {
    return target as WidgetRecord[];
  }
  if (target && typeof target === "object") {
    return Object.entries(target).map(([key, value]) => ({
      [labelField]: key,
      [valueField]: value,
    }));
  }
  return [];
}

export function BreakdownCard({ config, range }: BreakdownCardProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useWidgetData(config.source, range);
  const raw =
    config.options.dataPath !== undefined ? getByPath(data, config.options.dataPath) : data;
  const rows = toRows(raw, config.options.labelField, config.options.valueField);
  const { labelField, valueField, format, labelPrefix } = config.options;

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
          const rawLabel = String(row[labelField] ?? "");
          const label = labelPrefix ? t(`${labelPrefix}.${rawLabel}`) : rawLabel;
          return (
            <div key={`${rawLabel}-${index}`}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{label}</span>
                <span className="font-medium">
                  {format === "currency" ? formatCurrency(num) : formatNumber(num)}
                </span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </WidgetFrame>
  );
}
