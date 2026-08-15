"use client";

import type { WidgetDateRange } from "@/features/dashboard/hooks/use-widget-data";
import { useWidgetData } from "@/features/dashboard/hooks/use-widget-data";
import type { RankedListWidgetConfig } from "@/features/dashboard/schemas/widget-config.schema";
import type { WidgetRecord } from "@/features/dashboard/types/dashboard.types";
import { formatCurrency, formatNumber } from "@/lib/format";
import { WidgetFrame } from "./widget-frame";

interface RankedListProps {
  config: RankedListWidgetConfig;
  range: WidgetDateRange;
}

export function RankedList({ config, range }: RankedListProps) {
  const { data, isLoading, isError, refetch } = useWidgetData(config.source, range);
  const rows: WidgetRecord[] = Array.isArray(data) ? (data as WidgetRecord[]) : [];
  const { rankField, labelField, valueFields } = config.options;

  return (
    <WidgetFrame
      titleKey={config.titleKey}
      isLoading={isLoading}
      isError={isError}
      isEmpty={rows.length === 0}
      onRetry={refetch}
    >
      <ol className="space-y-3">
        {rows.map((row, index) => (
          <li key={`${row[labelField]}-${index}`} className="flex items-center gap-3">
            <span className="bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
              {row[rankField] ?? index + 1}
            </span>
            <span className="flex-1 truncate text-sm">{row[labelField]}</span>
            <span className="flex items-center gap-2 text-sm font-medium">
              {valueFields.map((vf) => {
                const raw = row[vf.key];
                const num = typeof raw === "number" ? raw : Number(raw ?? 0);
                return (
                  <span key={vf.key}>
                    {vf.format === "currency" ? formatCurrency(num) : formatNumber(num)}
                  </span>
                );
              })}
            </span>
          </li>
        ))}
      </ol>
    </WidgetFrame>
  );
}
