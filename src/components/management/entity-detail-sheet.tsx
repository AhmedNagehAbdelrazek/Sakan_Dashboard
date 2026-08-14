"use client";

import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useTranslation } from "@/lib/i18n/client";

export interface EntityDetailField<T> {
  key: string;
  labelKey: string;
  render: (record: T) => ReactNode;
}

interface EntityDetailSheetProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleKey: string;
  record: T | null;
  fields: EntityDetailField<T>[];
}

export function EntityDetailSheet<T>({
  open,
  onOpenChange,
  titleKey,
  record,
  fields,
}: EntityDetailSheetProps<T>) {
  const { t } = useTranslation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t(titleKey)}</SheetTitle>
        </SheetHeader>
        {record && (
          <dl className="space-y-4 px-4 pt-4">
            {fields.map((field) => (
              <div key={field.key}>
                <dt className="text-muted-foreground text-sm">{t(field.labelKey)}</dt>
                <dd className="mt-0.5 text-sm font-medium">{field.render(record)}</dd>
              </div>
            ))}
          </dl>
        )}
      </SheetContent>
    </Sheet>
  );
}
