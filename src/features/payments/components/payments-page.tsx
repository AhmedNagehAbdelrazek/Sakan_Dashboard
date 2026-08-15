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
import { refundPaymentSchema } from "../schemas/payment.schema";
import { usePaymentActions, usePayments } from "../hooks/use-payments";
import type { Payment } from "../types/payment.types";

type RefundFormValues = {
  reason: string;
};

type ConfirmAction = "receive" | "release";

export function PaymentsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Payment | null>(null);
  const [refunding, setRefunding] = useState<Payment | null>(null);
  const [confirm, setConfirm] = useState<{ payment: Payment; action: ConfirmAction } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = usePayments();
  const actions = usePaymentActions();

  const items = data?.items ?? [];
  const filtered = search.trim()
    ? items.filter((payment) =>
        [
          payment.student?.username,
          payment.landlord?.username,
          payment.application?.id,
          payment.applicationId,
          payment.id,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search.toLowerCase())),
      )
    : items;

  const pendingAction = actions.receive.isPending || actions.release.isPending;

  const runConfirm = async () => {
    if (!confirm) return;
    setError(null);
    try {
      if (confirm.action === "receive") {
        await actions.receive.mutateAsync(confirm.payment.id);
      } else {
        await actions.release.mutateAsync(confirm.payment.id);
      }
      setConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  };

  const handleRefund = async (values: RefundFormValues) => {
    if (!refunding) return;
    setError(null);
    try {
      await actions.refund.mutateAsync({
        id: refunding.id,
        input: { reason: values.reason.trim() },
      });
      setRefunding(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  };

  const formatAmount = (payment: Payment) =>
    payment.amount != null
      ? `${payment.amount} ${payment.currency ?? ""}`.trim()
      : t("common.noData");

  return (
    <div className="space-y-4">
      <EntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholderKey="common.search"
      />
      <EntityTable<Payment>
        columns={[
          {
            key: "application",
            headerKey: "payments.columns.application",
            render: (payment) =>
              payment.application?.id || payment.applicationId || t("common.noData"),
          },
          {
            key: "amount",
            headerKey: "payments.columns.amount",
            render: formatAmount,
          },
          {
            key: "method",
            headerKey: "payments.columns.method",
            render: (payment) => payment.method || t("common.noData"),
          },
          {
            key: "status",
            headerKey: "payments.columns.status",
            render: (payment) => (
              <Badge
                variant={
                  payment.status === "released" || payment.status === "received"
                    ? "default"
                    : "secondary"
                }
              >
                {t(`payments.status.${payment.status}`)}
              </Badge>
            ),
          },
        ]}
        rows={filtered}
        rowKey={(payment) => payment.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={setSelected}
        emptyTitleKey="payments.empty"
      />
      <EntityPagination
        meta={data}
        onPageChange={() => undefined}
        pageLabelKey="common.pagination"
        previousLabelKey="common.previous"
        nextLabelKey="common.next"
      />
      <EntityDetailSheet<Payment>
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        titleKey="payments.detail.title"
        record={selected}
        fields={[
          {
            key: "application",
            labelKey: "payments.columns.application",
            render: (payment) =>
              payment.application?.id || payment.applicationId || t("common.noData"),
          },
          {
            key: "student",
            labelKey: "payments.columns.student",
            render: (payment) =>
              payment.student?.username || payment.studentId || t("common.noData"),
          },
          {
            key: "landlord",
            labelKey: "payments.columns.landlord",
            render: (payment) =>
              payment.landlord?.username || payment.landlordId || t("common.noData"),
          },
          {
            key: "amount",
            labelKey: "payments.columns.amount",
            render: formatAmount,
          },
          {
            key: "method",
            labelKey: "payments.columns.method",
            render: (payment) => payment.method || t("common.noData"),
          },
          {
            key: "status",
            labelKey: "payments.columns.status",
            render: (payment) => t(`payments.status.${payment.status}`),
          },
          {
            key: "receivedAt",
            labelKey: "payments.detail.receivedAt",
            render: (payment) =>
              payment.receivedAt
                ? new Date(payment.receivedAt).toLocaleString()
                : t("common.noData"),
          },
          {
            key: "releasedAt",
            labelKey: "payments.detail.releasedAt",
            render: (payment) =>
              payment.releasedAt
                ? new Date(payment.releasedAt).toLocaleString()
                : t("common.noData"),
          },
          {
            key: "refundReason",
            labelKey: "payments.detail.refundReason",
            render: (payment) => payment.refundReason || t("common.noData"),
          },
          {
            key: "refundedAt",
            labelKey: "payments.detail.refundedAt",
            render: (payment) =>
              payment.refundedAt
                ? new Date(payment.refundedAt).toLocaleString()
                : t("common.noData"),
          },
        ]}
        footer={
          selected &&
          (selected.status === "pending" || selected.status === "received") && (
            <>
              {selected.status === "pending" && (
                <Button onClick={() => setConfirm({ payment: selected, action: "receive" })}>
                  {t("common.receive")}
                </Button>
              )}
              {selected.status === "received" && (
                <Button onClick={() => setConfirm({ payment: selected, action: "release" })}>
                  {t("common.release")}
                </Button>
              )}
              <Button variant="outline" onClick={() => setRefunding(selected)}>
                {t("common.refund")}
              </Button>
            </>
          )
        }
      />
      <EntityFormDialog<RefundFormValues>
        open={Boolean(refunding)}
        onOpenChange={(open) => {
          if (!open) setRefunding(null);
        }}
        titleKey="payments.refund.title"
        descriptionKey="payments.refund.description"
        submitLabelKey="common.refund"
        schema={refundPaymentSchema}
        fields={[
          {
            name: "reason",
            labelKey: "payments.refund.reason",
            type: "textarea",
          },
        ]}
        isSubmitting={actions.refund.isPending}
        onSubmit={handleRefund}
      />
      <EntityDeleteDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        titleKey={
          confirm?.action === "receive"
            ? "payments.confirm.receive.title"
            : "payments.confirm.release.title"
        }
        descriptionKey={
          confirm?.action === "receive"
            ? "payments.confirm.receive.description"
            : "payments.confirm.release.description"
        }
        confirmLabelKey={confirm?.action === "receive" ? "common.receive" : "common.release"}
        cancelLabelKey="common.cancel"
        isPending={pendingAction}
        businessErrorMessage={error}
        onConfirm={runConfirm}
      />
    </div>
  );
}
