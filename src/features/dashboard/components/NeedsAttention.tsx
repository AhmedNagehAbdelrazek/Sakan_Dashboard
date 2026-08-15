"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { WidgetFrame } from "@/components/dashboard/widget-frame";
import type { WidgetDateRange } from "@/features/dashboard/hooks/use-widget-data";
import { useDashboardMetrics } from "@/features/dashboard/hooks/use-dashboard-metrics";
import { useTranslation } from "@/lib/i18n/client";

interface NeedsAttentionProps {
  range: WidgetDateRange;
  limit?: number;
}

interface NeedsAttentionCategory {
  key: "applications" | "payments" | "propertyRequests" | "properties";
  titleKey: string;
  href: string;
  itemLabel: (item: Record<string, unknown>) => string;
}

export function NeedsAttention({ range, limit = 3 }: NeedsAttentionProps) {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useDashboardMetrics(range);

  const needsAttention = data?.needsAttention;
  const isEmpty =
    !isLoading &&
    !isError &&
    (!needsAttention ||
      (needsAttention.applications.length === 0 &&
        needsAttention.payments.length === 0 &&
        needsAttention.propertyRequests.length === 0 &&
        needsAttention.properties.length === 0));

  const categories: NeedsAttentionCategory[] = [
    {
      key: "applications",
      titleKey: "dashboard.needsAttention.applications",
      href: "/admin/applications",
      itemLabel: (item) => {
        const message = item.message;
        return typeof message === "string" && message.trim() !== "" ? message : t("common.noData");
      },
    },
    {
      key: "payments",
      titleKey: "dashboard.needsAttention.payments",
      href: "/admin/payments",
      itemLabel: (item) => {
        const amount = item.amount;
        const currency = item.currency;
        const amountText =
          typeof amount === "number" ? String(amount) : typeof amount === "string" ? amount : "";
        return (
          [amountText, typeof currency === "string" ? currency : ""].filter(Boolean).join(" ") ||
          t("common.noData")
        );
      },
    },
    {
      key: "propertyRequests",
      titleKey: "dashboard.needsAttention.propertyRequests",
      href: "/admin/property-requests",
      itemLabel: (item) => {
        const message = item.message;
        return typeof message === "string" && message.trim() !== "" ? message : t("common.noData");
      },
    },
    {
      key: "properties",
      titleKey: "dashboard.needsAttention.properties",
      href: "/admin/properties",
      itemLabel: (item) => {
        const title = item.title;
        return typeof title === "string" && title.trim() !== "" ? title : t("common.noData");
      },
    },
  ];

  const statusLabel = (item: Record<string, unknown>): string => {
    const status = item.status;
    return typeof status === "string" ? status : t("common.noData");
  };

  return (
    <WidgetFrame
      titleKey="dashboard.needsAttention.title"
      isLoading={isLoading}
      isError={isError}
      isEmpty={isEmpty}
      onRetry={refetch}
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => {
          const items = needsAttention?.[category.key] ?? [];
          const visible = items.slice(0, limit);
          return (
            <div key={category.key} className="space-y-2">
              <Link
                href={category.href}
                className="flex items-center justify-between text-sm font-semibold hover:underline"
              >
                <span>{t(category.titleKey)}</span>
                <span className="text-muted-foreground">{items.length}</span>
              </Link>
              {visible.length === 0 ? (
                <p className="text-muted-foreground text-xs">{t("common.noData")}</p>
              ) : (
                <ul className="space-y-2">
                  {visible.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-2 rounded-md border p-2"
                    >
                      <span className="truncate text-sm">{category.itemLabel(item)}</span>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {statusLabel(item)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </WidgetFrame>
  );
}
