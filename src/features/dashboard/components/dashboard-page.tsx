"use client";

import { useState } from "react";
import { format, subDays } from "date-fns";
import { WidgetRenderer } from "@/components/dashboard/widget-renderer";
import { appConfig } from "@/config/app.config";
import { useTranslation } from "@/lib/i18n/client";
import { DateRangeFilter } from "./DateRangeFilter";
import { RecentActivities } from "./RecentActivities";

interface DateRange {
  from: string;
  to: string;
}

const today = new Date();

export function DashboardPage() {
  const { t } = useTranslation();
  const [range, setRange] = useState<DateRange>({
    from: format(
      subDays(today, appConfig.dashboard.defaultDateRangeDays - 1),
      "yyyy-MM-dd",
    ),
    to: format(today, "yyyy-MM-dd"),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("admin.dashboard.title")}</h1>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {appConfig.dashboard.widgets.map((widget) => (
          <WidgetRenderer key={widget.id} config={widget} range={range} />
        ))}
      </div>
      <RecentActivities />
    </div>
  );
}
