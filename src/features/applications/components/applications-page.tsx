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
import { rejectApplicationSchema } from "../schemas/application.schema";
import {
  useApplicationActions,
  useApplications,
  useApplicationDetail,
} from "../hooks/use-applications";
import type { Application } from "../types/application.types";

type RejectFormValues = {
  reasonCategory:
    | "not_available"
    | "not_interested"
    | "payment_issue"
    | "documents_missing"
    | "other";
  detail?: string;
};

interface ConfirmState {
  application: Application;
  action: "approve" | "complete";
}

export function ApplicationsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [rejecting, setRejecting] = useState<Application | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useApplications();
  const detail = useApplicationDetail(selected?.id ?? null);
  const actions = useApplicationActions();

  const items = data?.items ?? [];
  const filtered = search.trim()
    ? items.filter((application) =>
        [application.property?.title, application.user?.username, application.id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
      )
    : items;

  const pendingAction = actions.approve.isPending || actions.complete.isPending;

  const runConfirm = async () => {
    if (!confirm) return;
    setError(null);
    try {
      if (confirm.action === "approve") {
        await actions.approve.mutateAsync(confirm.application.id);
      } else {
        await actions.complete.mutateAsync(confirm.application.id);
      }
      setConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  };

  const handleReject = async (values: RejectFormValues) => {
    if (!rejecting) return;
    setError(null);
    try {
      await actions.reject.mutateAsync({
        id: rejecting.id,
        input: {
          reasonCategory: values.reasonCategory,
          detail: values.detail?.trim() || undefined,
        },
      });
      setRejecting(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  };

  const record = detail.data ?? selected;

  return (
    <div className="space-y-4">
      <EntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholderKey="common.search"
      />
      <EntityTable<Application>
        columns={[
          {
            key: "applicant",
            headerKey: "applications.columns.applicant",
            render: (application) =>
              application.user?.username || application.user?.email || t("common.noData"),
          },
          {
            key: "property",
            headerKey: "applications.columns.property",
            render: (application) => application.property?.title || t("common.noData"),
          },
          {
            key: "status",
            headerKey: "applications.columns.status",
            render: (application) => (
              <Badge
                variant={
                  application.status === "completed" || application.status === "approved"
                    ? "default"
                    : "secondary"
                }
              >
                {t(`applications.status.${application.status}`)}
              </Badge>
            ),
          },
          {
            key: "createdAt",
            headerKey: "applications.columns.createdAt",
            render: (application) =>
              application.createdAt
                ? new Date(application.createdAt).toLocaleString()
                : t("common.noData"),
          },
        ]}
        rows={filtered}
        rowKey={(application) => application.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={setSelected}
        emptyTitleKey="applications.empty"
      />
      <EntityPagination
        meta={data}
        onPageChange={() => undefined}
        pageLabelKey="common.pagination"
        previousLabelKey="common.previous"
        nextLabelKey="common.next"
      />
      <EntityDetailSheet<Application>
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        titleKey="applications.detail.title"
        record={record}
        fields={[
          {
            key: "property",
            labelKey: "applications.detail.property",
            render: (application) =>
              detail.data?.property?.title || application.property?.title || t("common.noData"),
          },
          {
            key: "applicant",
            labelKey: "applications.columns.applicant",
            render: (application) =>
              detail.data?.user?.username || application.user?.username || t("common.noData"),
          },
          {
            key: "status",
            labelKey: "applications.columns.status",
            render: (application) => t(`applications.status.${application.status}`),
          },
          {
            key: "approvalExpiresAt",
            labelKey: "applications.detail.approvalExpiresAt",
            render: (_application) =>
              detail.data?.approvalExpiresAt
                ? new Date(detail.data.approvalExpiresAt).toLocaleString()
                : t("common.noData"),
          },
          {
            key: "approvedAt",
            labelKey: "applications.detail.approvedAt",
            render: (_application) =>
              detail.data?.approvedAt
                ? new Date(detail.data.approvedAt).toLocaleString()
                : t("common.noData"),
          },
          {
            key: "completedAt",
            labelKey: "applications.detail.completedAt",
            render: (_application) =>
              detail.data?.completedAt
                ? new Date(detail.data.completedAt).toLocaleString()
                : t("common.noData"),
          },
        ]}
        footer={
          selected &&
          (selected.status === "pending" || selected.status === "approved") && (
            <>
              {selected.status === "pending" && (
                <>
                  <Button onClick={() => setConfirm({ application: selected, action: "approve" })}>
                    {t("common.approve")}
                  </Button>
                  <Button variant="outline" onClick={() => setRejecting(selected)}>
                    {t("common.reject")}
                  </Button>
                </>
              )}
              {selected.status === "approved" && (
                <Button onClick={() => setConfirm({ application: selected, action: "complete" })}>
                  {t("common.complete")}
                </Button>
              )}
            </>
          )
        }
      />
      <EntityFormDialog<RejectFormValues>
        open={Boolean(rejecting)}
        onOpenChange={(open) => {
          if (!open) setRejecting(null);
        }}
        titleKey="applications.reject.title"
        descriptionKey="applications.reject.description"
        submitLabelKey="common.reject"
        schema={rejectApplicationSchema}
        fields={[
          {
            name: "reasonCategory",
            labelKey: "applications.reject.reasonCategory",
            type: "select",
            options: [
              "not_available",
              "not_interested",
              "payment_issue",
              "documents_missing",
              "other",
            ].map((value) => ({ value, labelKey: `applications.rejectCategories.${value}` })),
          },
          {
            name: "detail",
            labelKey: "applications.reject.detail",
            type: "textarea",
          },
        ]}
        isSubmitting={actions.reject.isPending}
        onSubmit={handleReject}
      />
      <EntityDeleteDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        titleKey={
          confirm?.action === "approve"
            ? "applications.confirm.approve.title"
            : "applications.confirm.complete.title"
        }
        descriptionKey={
          confirm?.action === "approve"
            ? "applications.confirm.approve.description"
            : "applications.confirm.complete.description"
        }
        confirmLabelKey={confirm?.action === "approve" ? "common.approve" : "common.complete"}
        cancelLabelKey="common.cancel"
        isPending={pendingAction}
        businessErrorMessage={error}
        onConfirm={runConfirm}
      />
    </div>
  );
}
