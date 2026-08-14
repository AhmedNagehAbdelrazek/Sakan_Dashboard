"use client";

import { useEffect } from "react";
import type { DefaultValues, FieldErrors, FieldValues, Path, Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ZodType } from "zod";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/client";

export interface EntityFormFieldConfig {
  name: string;
  labelKey: string;
  type?: "text" | "number" | "textarea";
  placeholderKey?: string;
}

interface EntityFormDialogProps<TValues extends FieldValues> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  titleKey: string;
  descriptionKey?: string;
  submitLabelKey: string;
  schema: ZodType<TValues>;
  fields: EntityFormFieldConfig[];
  initialValues?: Partial<TValues>;
  isSubmitting?: boolean;
  onSubmit: (values: TValues) => void;
}

function createResolver<TValues extends FieldValues>(schema: ZodType<TValues>): Resolver<TValues> {
  return (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const fieldErrors: Record<string, { message: string }> = {};
    for (const issue of result.error.issues) {
      fieldErrors[issue.path.join(".") || "root"] = { message: issue.message };
    }
    return {
      values: {},
      errors: fieldErrors as unknown as FieldErrors<TValues>,
    };
  };
}

export function EntityFormDialog<TValues extends FieldValues>({
  open,
  onOpenChange,
  titleKey,
  descriptionKey,
  submitLabelKey,
  schema,
  fields,
  initialValues,
  isSubmitting,
  onSubmit,
}: EntityFormDialogProps<TValues>) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TValues>({
    resolver: createResolver(schema),
    defaultValues: (initialValues ?? {}) as DefaultValues<TValues>,
  });

  useEffect(() => {
    if (open) {
      reset((initialValues ?? {}) as DefaultValues<TValues>);
    }
  }, [open, initialValues, reset]);

  const errorFor = (name: string): string | undefined =>
    (errors as Record<string, { message?: string }>)[name]?.message;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          {descriptionKey && <DialogDescription>{t(descriptionKey)}</DialogDescription>}
        </DialogHeader>
        <form id="entity-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {fields.map((field) => {
            const error = errorFor(field.name);
            const placeholder = field.placeholderKey ? t(field.placeholderKey) : undefined;
            return (
              <FormField key={field.name} label={t(field.labelKey)} error={error}>
                {field.type === "textarea" ? (
                  <Textarea
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    {...register(field.name as Path<TValues>)}
                  />
                ) : (
                  <Input
                    type={field.type === "number" ? "number" : "text"}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    {...register(field.name as Path<TValues>)}
                  />
                )}
              </FormField>
            );
          })}
        </form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" form="entity-form" disabled={isSubmitting}>
            {t(submitLabelKey)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
