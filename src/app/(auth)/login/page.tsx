"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { useAdminStore } from "@/lib/stores/admin.store";
import { useTranslation } from "@/lib/i18n/client";
import { AdminLoginForm } from "@/features/auth/components/AdminLoginForm";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const adminUser = useAdminStore((state) => state.adminUser);

  useEffect(() => {
    if (adminUser) {
      router.push("/admin");
    }
  }, [adminUser, router]);

  if (adminUser) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 px-4">
        <div className="space-y-2 text-center">
          <BrandLogo href="/admin" className="justify-center text-2xl font-bold" />
          <p className="text-sm text-muted-foreground">{t("admin.login.title")}</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
