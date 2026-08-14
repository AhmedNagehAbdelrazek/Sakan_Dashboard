"use client";

import { useTranslation } from "@/lib/i18n/client";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("admin.sidebar.settings")}</h1>
      <p className="text-sm text-muted-foreground">{t("admin.settings.placeholder")}</p>
    </div>
  );
}
