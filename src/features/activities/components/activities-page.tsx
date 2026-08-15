"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { EntityDetailSheet } from "@/components/management/entity-detail-sheet";
import { EntityPagination } from "@/components/management/entity-pagination";
import { EntityTable } from "@/components/management/entity-table";
import { EntityToolbar } from "@/components/management/entity-toolbar";
import { useTranslation } from "@/lib/i18n/client";
import { useActivities } from "../hooks/use-activities";
import type { Activity } from "../types/activity.types";

export function ActivitiesPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Activity | null>(null);

  const { data, isLoading, isError, refetch } = useActivities();

  const items = data?.items ?? [];
  const filtered = search.trim()
    ? items.filter((activity) => {
        const username = activity.User?.username ?? "";
        const type = activity.activityType ?? "";
        return username.toLowerCase().includes(search.toLowerCase()) ||
          type.toLowerCase().includes(search.toLowerCase());
      })
    : items;

  return (
    <div className="space-y-4">
      <EntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholderKey="common.search"
      />
      <EntityTable<Activity>
        columns={[
          {
            key: "user",
            headerKey: "activities.columns.user",
            render: (activity) => activity.User?.username || activity.userId || t("common.noData"),
          },
          {
            key: "type",
            headerKey: "activities.columns.type",
            render: (activity) => (
              <Badge variant="secondary">{activity.activityType || t("common.noData")}</Badge>
            ),
          },
          {
            key: "timestamp",
            headerKey: "activities.columns.timestamp",
            render: (activity) =>
              activity.timestamp
                ? new Date(activity.timestamp).toLocaleString()
                : t("common.noData"),
          },
        ]}
        rows={filtered}
        rowKey={(activity) => String(activity.id)}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={setSelected}
        emptyTitleKey="activities.empty"
      />
      <EntityPagination
        meta={data}
        onPageChange={() => undefined}
        pageLabelKey="common.pagination"
        previousLabelKey="common.previous"
        nextLabelKey="common.next"
      />
      <EntityDetailSheet<Activity>
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        titleKey="activities.detail.title"
        record={selected}
        fields={[
          {
            key: "user",
            labelKey: "activities.detail.user",
            render: (activity) => activity.User?.username || activity.userId || t("common.noData"),
          },
          {
            key: "type",
            labelKey: "activities.columns.type",
            render: (activity) => activity.activityType || t("common.noData"),
          },
          {
            key: "timestamp",
            labelKey: "activities.columns.timestamp",
            render: (activity) =>
              activity.timestamp
                ? new Date(activity.timestamp).toLocaleString()
                : t("common.noData"),
          },
          {
            key: "details",
            labelKey: "activities.columns.details",
            render: (activity) => (
              <pre className="whitespace-pre-wrap font-mono text-xs">
                {JSON.stringify(activity.activityDetails ?? {}, null, 2)}
              </pre>
            ),
          },
        ]}
      />
    </div>
  );
}
