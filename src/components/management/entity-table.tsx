"use client";

import type { ReactNode } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/lib/i18n/client";

export interface EntityTableColumn<T> {
  key: string;
  headerKey: string;
  render: (row: T) => ReactNode;
}

interface EntityTableProps<T> {
  columns: EntityTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  emptyTitleKey: string;
  emptyDescriptionKey?: string;
  onRowClick?: (row: T) => void;
  onRetry?: () => void;
}

export function EntityTable<T>({
  columns,
  rows,
  rowKey,
  isLoading,
  isError,
  emptyTitleKey,
  emptyDescriptionKey,
  onRowClick,
  onRetry,
}: EntityTableProps<T>) {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (isError) {
    return <ErrorState title={t("errors.generic")} onRetry={onRetry} />;
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title={t(emptyTitleKey)}
        description={emptyDescriptionKey ? t(emptyDescriptionKey) : undefined}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{t(column.headerKey)}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow
            key={rowKey(row)}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={onRowClick ? "cursor-pointer" : undefined}
          >
            {columns.map((column) => (
              <TableCell key={column.key}>{column.render(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
