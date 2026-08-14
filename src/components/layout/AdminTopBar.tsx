"use client";

import { useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/stores/admin.store";
import { useTranslation } from "@/lib/i18n/client";
import { adminAuthService } from "@/features/auth/services/adminAuthService";
import { Button } from "@/components/forms/Button";

export function AdminTopBar() {
  const { t } = useTranslation();
  const router = useRouter();
  const adminUser = useAdminStore((state) => state.adminUser);
  const logout = useAdminStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div />
      <div className="flex items-center gap-4">
        {adminUser && (
          <span className="text-sm font-medium">{adminUser.name}</span>
        )}
        <Button variant="outline" size="sm" onClick={handleLogout}>
          {t("admin.topbar.logout")}
        </Button>
      </div>
    </header>
  );
}
