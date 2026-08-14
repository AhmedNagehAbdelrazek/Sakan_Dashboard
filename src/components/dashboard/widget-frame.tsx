"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useTranslation } from "@/lib/i18n/client";

interface WidgetFrameProps {
  titleKey: string;
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function WidgetFrame({
  titleKey,
  isLoading,
  isError,
  isEmpty,
  onRetry,
  children,
}: WidgetFrameProps) {
  const { t } = useTranslation();

  let body: React.ReactNode;

  if (isLoading) {
    body = <LoadingState variant="skeleton" />;
  } else if (isError) {
    body = <ErrorState title={t("errors.generic")} onRetry={onRetry} />;
  } else if (isEmpty) {
    body = <EmptyState title={t("common.noData")} />;
  } else {
    body = children;
  }

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold">{t(titleKey)}</h3>
      {body}
    </div>
  );
}
