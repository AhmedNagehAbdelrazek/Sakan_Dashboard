"use client";

import type { WidgetDateRange } from "@/features/dashboard/hooks/use-widget-data";
import { useWidgetData } from "@/features/dashboard/hooks/use-widget-data";
import type { ChartWidgetConfig } from "@/features/dashboard/schemas/widget-config.schema";
import type { WidgetRecord } from "@/features/dashboard/types/dashboard.types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { WidgetFrame } from "./widget-frame";

interface ChartCardProps {
  config: ChartWidgetConfig;
  range: WidgetDateRange;
}

export function ChartCard({ config, range }: ChartCardProps) {
  const { data, isLoading, isError, refetch } = useWidgetData(
    config.source,
    range,
  );
  const rows: WidgetRecord[] = Array.isArray(data)
    ? (data as WidgetRecord[])
    : [];
  const { chartType, xField, yFields } = config.options;

  const chart =
    chartType === "bar" ? (
      <BarChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        {yFields.map((y) => (
          <Bar key={y} dataKey={y} fill="hsl(var(--primary))" />
        ))}
      </BarChart>
    ) : chartType === "area" ? (
      <AreaChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        {yFields.map((y) => (
          <Area
            key={y}
            type="monotone"
            dataKey={y}
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.2}
          />
        ))}
      </AreaChart>
    ) : (
      <LineChart data={rows}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Legend />
        {yFields.map((y) => (
          <Line key={y} type="monotone" dataKey={y} stroke="hsl(var(--primary))" />
        ))}
      </LineChart>
    );

  return (
    <WidgetFrame
      titleKey={config.titleKey}
      isLoading={isLoading}
      isError={isError}
      isEmpty={rows.length === 0}
      onRetry={refetch}
    >
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chart}
        </ResponsiveContainer>
      </div>
    </WidgetFrame>
  );
}
