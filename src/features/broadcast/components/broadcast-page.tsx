"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/forms/FormField";
import { useTranslation } from "@/lib/i18n/client";
import { broadcastSchema, type BroadcastSchema } from "../schemas/broadcast.schema";
import { useBroadcast } from "../hooks/use-broadcast";
import type { BroadcastResult } from "../types/broadcast.types";

export function BroadcastPage() {
  const { t } = useTranslation();
  const broadcast = useBroadcast();
  const [result, setResult] = useState<BroadcastResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BroadcastSchema>({
    resolver: zodResolver(broadcastSchema),
  });

  const onSubmit = async (values: BroadcastSchema) => {
    setError(null);
    setResult(null);
    try {
      const payload = await broadcast.mutateAsync(values);
      setResult(payload);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      {result && (
        <div className="bg-muted rounded-md p-3 text-sm" role="status">
          {t("broadcast.success").replace("{count}", String(result.recipients))}
        </div>
      )}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm" role="alert">
          {error}
        </div>
      )}
      <FormField label={t("broadcast.title.label")} error={errors.title?.message}>
        <Input
          placeholder={t("broadcast.title.placeholder")}
          aria-invalid={Boolean(errors.title)}
          {...register("title")}
        />
      </FormField>
      <FormField label={t("broadcast.body.label")} error={errors.body?.message}>
        <Textarea
          placeholder={t("broadcast.body.placeholder")}
          aria-invalid={Boolean(errors.body)}
          {...register("body")}
        />
      </FormField>
      <FormField label={t("broadcast.type.label")} error={errors.type?.message}>
        <Input
          placeholder={t("broadcast.type.placeholder")}
          aria-invalid={Boolean(errors.type)}
          {...register("type")}
        />
      </FormField>
      <Button type="submit" disabled={broadcast.isPending}>
        {broadcast.isPending ? t("broadcast.sending") : t("broadcast.send")}
      </Button>
    </form>
  );
}
