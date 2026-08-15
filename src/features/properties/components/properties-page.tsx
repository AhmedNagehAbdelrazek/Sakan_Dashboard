"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EntityDetailSheet } from "@/components/management/entity-detail-sheet";
import { EntityDeleteDialog } from "@/components/management/entity-delete-dialog";
import { EntityFormDialog } from "@/components/management/entity-form-dialog";
import { EntityPagination } from "@/components/management/entity-pagination";
import { EntityTable } from "@/components/management/entity-table";
import { EntityToolbar } from "@/components/management/entity-toolbar";
import { useTranslation } from "@/lib/i18n/client";
import { declinePropertySchema } from "../schemas/property.schema";
import { usePropertyActions, useProperties } from "../hooks/use-properties";
import type { Property, PropertyState } from "../types/property.types";

type DeclineFormValues = {
  reason?: string;
};

interface ConfirmState {
  property: Property;
  action: "approve" | "reopen";
}

export function PropertiesPage() {
  const { t } = useTranslation();
  const [state, setState] = useState<PropertyState | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Property | null>(null);
  const [declining, setDeclining] = useState<Property | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useProperties(state);
  const actions = usePropertyActions();

  const items = data?.items ?? [];
  const filtered = search.trim()
    ? items.filter((property) => property.title.toLowerCase().includes(search.toLowerCase()))
    : items;

  const pendingAction = actions.approve.isPending || actions.reopen.isPending;

  const runConfirm = async () => {
    if (!confirm) return;
    setError(null);
    try {
      if (confirm.action === "approve") {
        await actions.approve.mutateAsync(confirm.property.id);
      } else {
        await actions.reopen.mutateAsync(confirm.property.id);
      }
      setConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  };

  const handleDecline = async (values: DeclineFormValues) => {
    if (!declining) return;
    setError(null);
    try {
      await actions.decline.mutateAsync({
        id: declining.id,
        reason: values.reason?.trim() || undefined,
      });
      setDeclining(null);
      setSelected((current) =>
        current && current.id === declining.id ? { ...current, state: "declined" } : current,
      );
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
        filters={[
          {
            key: "state",
            placeholderKey: "properties.filter.state",
            value: state,
            onValueChange: (value) => setState(value as PropertyState | "all"),
            options: [
              { value: "all", labelKey: "properties.states.all" },
              { value: "sent", labelKey: "properties.states.sent" },
              { value: "approved", labelKey: "properties.states.approved" },
              { value: "declined", labelKey: "properties.states.declined" },
            ],
          },
        ]}
      />
      <EntityTable<Property>
        columns={[
          {
            key: "title",
            headerKey: "properties.columns.title",
            render: (property) => <span className="font-medium">{property.title}</span>,
          },
          {
            key: "type",
            headerKey: "properties.columns.type",
            render: (property) => property.type || t("common.noData"),
          },
          {
            key: "price",
            headerKey: "properties.columns.price",
            render: (property) =>
              property.pricePerMonth != null
                ? `${property.pricePerMonth} ${property.currency ?? ""}`.trim()
                : t("common.noData"),
          },
          {
            key: "state",
            headerKey: "properties.columns.state",
            render: (property) => (
              <Badge variant={property.state === "approved" ? "default" : "secondary"}>
                {t(`properties.states.${property.state}`)}
              </Badge>
            ),
          },
          {
            key: "owner",
            headerKey: "properties.columns.owner",
            render: (property) => property.owner?.username || t("common.noData"),
          },
        ]}
        rows={filtered}
        rowKey={(property) => property.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={setSelected}
        emptyTitleKey="properties.empty"
      />
      <EntityPagination
        meta={data}
        onPageChange={() => undefined}
        pageLabelKey="common.pagination"
        previousLabelKey="common.previous"
        nextLabelKey="common.next"
      />
      <EntityDetailSheet<Property>
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        titleKey="properties.detail.title"
        record={selected}
        fields={[
          {
            key: "title",
            labelKey: "properties.columns.title",
            render: (property) => property.title,
          },
          {
            key: "description",
            labelKey: "properties.detail.description",
            render: (property) => property.description || t("common.noData"),
          },
          {
            key: "address",
            labelKey: "properties.detail.address",
            render: (property) => property.address || t("common.noData"),
          },
          {
            key: "owner",
            labelKey: "properties.columns.owner",
            render: (property) =>
              property.owner
                ? `${property.owner.username} (${property.owner.email ?? property.owner.id ?? ""})`
                : t("common.noData"),
          },
          {
            key: "price",
            labelKey: "properties.columns.price",
            render: (property) =>
              property.pricePerMonth != null
                ? `${property.pricePerMonth} ${property.currency ?? ""}`.trim()
                : t("common.noData"),
          },
          {
            key: "rooms",
            labelKey: "properties.detail.totalRooms",
            render: (property) => property.totalRooms ?? t("common.noData"),
          },
          {
            key: "available",
            labelKey: "properties.detail.availableRooms",
            render: (property) => property.availableRooms ?? t("common.noData"),
          },
          {
            key: "state",
            labelKey: "properties.columns.state",
            render: (property) => t(`properties.states.${property.state}`),
          },
        ]}
        footer={
          selected && (
            <>
              {selected.state === "sent" && (
                <>
                  <Button onClick={() => setConfirm({ property: selected, action: "approve" })}>
                    {t("common.approve")}
                  </Button>
                  <Button variant="outline" onClick={() => setDeclining(selected)}>
                    {t("common.decline")}
                  </Button>
                </>
              )}
              {selected.state === "declined" && (
                <Button onClick={() => setConfirm({ property: selected, action: "reopen" })}>
                  {t("common.reopen")}
                </Button>
              )}
            </>
          )
        }
      />
      <EntityFormDialog<DeclineFormValues>
        open={Boolean(declining)}
        onOpenChange={(open) => {
          if (!open) setDeclining(null);
        }}
        titleKey="properties.decline.title"
        descriptionKey="properties.decline.description"
        submitLabelKey="common.decline"
        schema={declinePropertySchema}
        fields={[
          {
            name: "reason",
            labelKey: "properties.decline.reason",
            type: "textarea",
            placeholderKey: "properties.decline.placeholder",
          },
        ]}
        isSubmitting={actions.decline.isPending}
        onSubmit={handleDecline}
      />
      <EntityDeleteDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        titleKey={
          confirm?.action === "approve"
            ? "properties.confirm.approve.title"
            : "properties.confirm.reopen.title"
        }
        descriptionKey={
          confirm?.action === "approve"
            ? "properties.confirm.approve.description"
            : "properties.confirm.reopen.description"
        }
        confirmLabelKey={confirm?.action === "approve" ? "common.approve" : "common.reopen"}
        cancelLabelKey="common.cancel"
        isPending={pendingAction}
        businessErrorMessage={error}
        onConfirm={runConfirm}
      />
    </div>
  );
}
