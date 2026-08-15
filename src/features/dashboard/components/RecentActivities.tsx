"use client";

import { WidgetFrame } from "@/components/dashboard/widget-frame";
import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";
import { useTranslation } from "@/lib/i18n/client";

export function RecentActivities() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useDashboardMetrics();
  const activities = data?.recentActivities ?? [];
  const isEmpty = !isLoading && !isError && activities.length === 0;

  return (
    <WidgetFrame
      titleKey="dashboard.widgets.recentActivities"
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty}
      onRetry={refetch}
    >
      <ul className="space-y-3">
        {activities.map((activity, index) => {
          const embedded =
            activity.User && typeof activity.User === "object"
              ? (activity.User as Record<string, unknown>)
              : undefined;
          const username =
            typeof embedded?.username === "string" ? embedded.username : undefined;
          const activityType =
            typeof activity.activityType === "string"
              ? activity.activityType
              : undefined;
          const label = [username, activityType].filter(Boolean).join(" · ");
          return (
            <li key={index} className="flex items-center gap-3 text-sm">
              <span className="bg-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {index + 1}
              </span>
              <span className="flex-1 truncate">
                {label || t("common.noData")}
              </span>
            </li>
          );
        })}
      </ul>
    </WidgetFrame>
  );
}
