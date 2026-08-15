"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { EntityDetailSheet } from "@/components/management/entity-detail-sheet";
import { EntityPagination } from "@/components/management/entity-pagination";
import { EntityTable } from "@/components/management/entity-table";
import { EntityToolbar } from "@/components/management/entity-toolbar";
import { useTranslation } from "@/lib/i18n/client";
import { useFlatmateRequests } from "../hooks/use-flatmate-requests";
import type { FlatmateRequest } from "../types/flatmateRequest.types";

export function FlatmateRequestsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<FlatmateRequest | null>(null);

  const { data, isLoading, isError, refetch } = useFlatmateRequests();

  const items = data?.items ?? [];
  const filtered = search.trim()
    ? items.filter((request) =>
        [request.user?.username, request.userId, request.preferredType]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
      )
    : items;

  return (
    <div className="space-y-4">
      <EntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholderKey="common.search"
      />
      <EntityTable<FlatmateRequest>
        columns={[
          {
            key: "user",
            headerKey: "flatmateRequests.columns.user",
            render: (request) => request.user?.username || request.userId || t("common.noData"),
          },
          {
            key: "budget",
            headerKey: "flatmateRequests.columns.budget",
            render: (request) =>
              request.preferredBudget != null ? String(request.preferredBudget) : t("common.noData"),
          },
          {
            key: "type",
            headerKey: "flatmateRequests.columns.type",
            render: (request) => request.preferredType || t("common.noData"),
          },
          {
            key: "people",
            headerKey: "flatmateRequests.columns.people",
            render: (request) =>
              request.peopleWanted != null ? String(request.peopleWanted) : t("common.noData"),
          },
          {
            key: "status",
            headerKey: "flatmateRequests.columns.status",
            render: (request) => (
              <Badge variant="secondary">
                {request.status ? t(`flatmateRequests.status.${request.status}`) : t("common.noData")}
              </Badge>
            ),
          },
        ]}
        rows={filtered}
        rowKey={(request) => request.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={setSelected}
        emptyTitleKey="flatmateRequests.empty"
      />
      <EntityPagination
        meta={data}
        onPageChange={() => undefined}
        pageLabelKey="common.pagination"
        previousLabelKey="common.previous"
        nextLabelKey="common.next"
      />
      <EntityDetailSheet<FlatmateRequest>
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        titleKey="flatmateRequests.detail.title"
        record={selected}
        fields={[
          {
            key: "user",
            labelKey: "flatmateRequests.columns.user",
            render: (request) => request.user?.username || request.userId || t("common.noData"),
          },
          {
            key: "budget",
            labelKey: "flatmateRequests.columns.budget",
            render: (request) =>
              request.preferredBudget != null ? String(request.preferredBudget) : t("common.noData"),
          },
          {
            key: "type",
            labelKey: "flatmateRequests.columns.type",
            render: (request) => request.preferredType || t("common.noData"),
          },
          {
            key: "people",
            labelKey: "flatmateRequests.columns.people",
            render: (request) =>
              request.peopleWanted != null ? String(request.peopleWanted) : t("common.noData"),
          },
          {
            key: "status",
            labelKey: "flatmateRequests.columns.status",
            render: (request) =>
              request.status ? t(`flatmateRequests.status.${request.status}`) : t("common.noData"),
          },
          {
            key: "joinInterests",
            labelKey: "flatmateRequests.detail.joinInterests",
            render: (request) =>
              request.joinInterests && request.joinInterests.length > 0
                ? JSON.stringify(request.joinInterests)
                : t("common.noData"),
          },
        ]}
      />
    </div>
  );
}
