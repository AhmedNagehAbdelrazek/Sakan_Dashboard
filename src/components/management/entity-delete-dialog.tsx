"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/client";

interface EntityDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleKey: string;
  descriptionKey: string;
  confirmLabelKey: string;
  cancelLabelKey: string;
  isPending?: boolean;
  businessErrorMessage?: string | null;
  onConfirm: () => void;
}

export function EntityDeleteDialog({
  open,
  onOpenChange,
  titleKey,
  descriptionKey,
  confirmLabelKey,
  cancelLabelKey,
  isPending,
  businessErrorMessage,
  onConfirm,
}: EntityDeleteDialogProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogDescription>{t(descriptionKey)}</DialogDescription>
        </DialogHeader>
        {businessErrorMessage && (
          <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm" role="alert">
            {businessErrorMessage}
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {t(cancelLabelKey)}
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isPending}>
            {t(confirmLabelKey)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
