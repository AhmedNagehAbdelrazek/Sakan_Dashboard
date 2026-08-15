"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/client";

export interface EntityListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface EntityPaginationProps {
  meta?: EntityListMeta;
  onPageChange: (page: number) => void;
  pageLabelKey: string;
  previousLabelKey: string;
  nextLabelKey: string;
}

export function EntityPagination({
  meta,
  onPageChange,
  pageLabelKey,
  previousLabelKey,
  nextLabelKey,
}: EntityPaginationProps) {
  const { t } = useTranslation();

  if (!meta || meta.totalPages <= 1) {
    return null;
  }

  const label = t(pageLabelKey)
    .replace("{page}", String(meta.page))
    .replace("{pages}", String(meta.totalPages));

  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">{label}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft />
          {t(previousLabelKey)}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
        >
          {t(nextLabelKey)}
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
