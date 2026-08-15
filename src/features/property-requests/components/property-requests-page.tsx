"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityDetailSheet } from "@/components/management/entity-detail-sheet";
import { EntityFormDialog } from "@/components/management/entity-form-dialog";
import { EntityPagination } from "@/components/management/entity-pagination";
import { EntityTable } from "@/components/management/entity-table";
import { EntityToolbar } from "@/components/management/entity-toolbar";
import { useTranslation } from "@/lib/i18n/client";
import { propertyRequestTransitionSchema } from "../schemas/propertyRequest.schema";
import {
  usePropertyRequestStatusUpdate,
  usePropertyRequests,
} from "../hooks/use-property-requests";
import type { PropertyRequest, PropertyRequestStatus } from "../types/propertyRequest.types";

const TRANSITION_TARGETS: Record<PropertyRequestStatus, PropertyRequestStatus[]> = {
  pending: ["contacted", "closed"],
  contacted: ["resolved", "closed"],
  resolved: [],
  closed: [],
};

type StatusFormValues = {
  status: "contacted" | "resolved" | "closed" | "";
};

export function PropertyRequestsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PropertyRequest | null>(null);
  const [updating, setUpdating] = useState<PropertyRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = usePropertyRequests();
  const updateStatus = usePropertyRequestStatusUpdate();

  const items = data?.items ?? [];
  const filtered = search.trim()
    ? items.filter((request) =>
        [request.message, request.major, request.address, request.propertyType]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
      )
    : items;

  const targets = updating ? TRANSITION_TARGETS[updating.status] : [];

  const handleStatusUpdate = async (values: StatusFormValues) => {
    if (!updating || !values.status) return;
    setError(null);
    try {
      await updateStatus.mutateAsync({
        id: updating.id,
        status: values.status as PropertyRequestStatus,
      });
      setUpdating(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  };

  return (
    <div className="space-y-4">
      <EntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholderKey="common.search"
      />
      <EntityTable<PropertyRequest>
        columns={[
          {
            key: "message",
            headerKey: "propertyRequests.columns.message",
            render: (request) => <span className="line-clamp-1">{request.message}</span>,
          },
          {
            key: "type",
            headerKey: "propertyRequests.columns.type",
            render: (request) => request.propertyType || t("common.noData"),
          },
          {
            key: "major",
            headerKey: "propertyRequests.columns.major",
            render: (request) => request.major || t("common.noData"),
          },
          {
            key: "address",
            headerKey: "propertyRequests.columns.address",
            render: (request) => request.address || t("common.noData"),
          },
          {
            key: "status",
            headerKey: "propertyRequests.columns.status",
            render: (request) => (
              <Badge variant={request.status === "resolved" ? "default" : "secondary"}>
                {t(`propertyRequests.status.${request.status}`)}
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
        emptyTitleKey="propertyRequests.empty"
      />
      <EntityPagination
        meta={data}
        onPageChange={() => undefined}
        pageLabelKey="common.pagination"
        previousLabelKey="common.previous"
        nextLabelKey="common.next"
      />
      <EntityDetailSheet<PropertyRequest>
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        titleKey="propertyRequests.detail.title"
        record={selected}
        fields={[
          {
            key: "user",
            labelKey: "propertyRequests.columns.user",
            render: (request) => request.user?.username || request.userId || t("common.noData"),
          },
          {
            key: "message",
            labelKey: "propertyRequests.columns.message",
            render: (request) => request.message || t("common.noData"),
          },
          {
            key: "type",
            labelKey: "propertyRequests.columns.type",
            render: (request) => request.propertyType || t("common.noData"),
          },
          {
            key: "requestType",
            labelKey: "propertyRequests.columns.requestType",
            render: (request) =>
              request.requestType
                ? t(`propertyRequests.requestTypes.${request.requestType}`)
                : t("common.noData"),
          },
          {
            key: "major",
            labelKey: "propertyRequests.columns.major",
            render: (request) => request.major || t("common.noData"),
          },
          {
            key: "address",
            labelKey: "propertyRequests.detail.address",
            render: (request) => request.address || t("common.noData"),
          },
          {
            key: "status",
            labelKey: "propertyRequests.columns.status",
            render: (request) => t(`propertyRequests.status.${request.status}`),
          },
        ]}
        footer={
          selected && TRANSITION_TARGETS[selected.status].length > 0 ? (
            <Button onClick={() => setUpdating(selected)}>
              {t("propertyRequests.statusUpdate.title")}
            </Button>
          ) : undefined
        }
      />
      <EntityFormDialog<StatusFormValues>
        open={Boolean(updating)}
        onOpenChange={(open) => {
          if (!open) setUpdating(null);
        }}
        titleKey="propertyRequests.statusUpdate.title"
        submitLabelKey="propertyRequests.statusUpdate.submit"
        schema={propertyRequestTransitionSchema}
        fields={[
          {
            name: "status",
            labelKey: "propertyRequests.columns.status",
            type: "select",
            options: targets.map((value) => ({
              value,
              labelKey: `propertyRequests.status.${value}`,
            })),
          },
        ]}
        initialValues={{ status: "" }}
        isSubmitting={updateStatus.isPending}
        onSubmit={handleStatusUpdate}
      />
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
