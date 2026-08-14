"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema, type AdminLoginFormData } from "../schemas/adminLogin.schema";
import { adminAuthService } from "../services/adminAuthService";
import { useAdminStore } from "@/lib/stores/admin.store";
import { useTranslation } from "@/lib/i18n/client";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/forms/FormField";
import { Input } from "@/components/forms/Input";
import { Button } from "@/components/forms/Button";

export function AdminLoginForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const login = useAdminStore((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = useCallback(
    async (data: AdminLoginFormData) => {
      if (cooldown) return;
      setIsSubmitting(true);
      setServerError(null);

      try {
        const response = await adminAuthService.login(data.email, data.password);
        login(response.user);
        router.push("/admin");
      } catch (err) {
        if (err instanceof Error) {
          const message = err.message;
          if (message.includes("401") || message.includes("Invalid")) {
            setServerError(t("admin.login.error"));
          } else {
            setServerError(t("admin.login.genericError"));
          }
        } else {
          setServerError(t("admin.login.genericError"));
        }
        setCooldown(true);
        setTimeout(() => setCooldown(false), 1000);
      } finally {
        setIsSubmitting(false);
      }
    },
    [cooldown, login, router, t],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert">
          {serverError}
        </div>
      )}
      <FormField label={t("admin.login.email")} error={errors.email?.message}>
        <Input
          type="email"
          placeholder={t("admin.login.emailPlaceholder")}
          error={!!errors.email}
          {...register("email")}
        />
      </FormField>
      <FormField label={t("admin.login.password")} error={errors.password?.message}>
        <Input
          type="password"
          placeholder={t("admin.login.passwordPlaceholder")}
          error={!!errors.password}
          {...register("password")}
        />
      </FormField>
      <Button type="submit" className="w-full" disabled={isSubmitting || cooldown}>
        {isSubmitting ? t("admin.login.submitting") : t("admin.login.submit")}
      </Button>
    </form>
  );
}
