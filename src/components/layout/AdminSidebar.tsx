"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appConfig } from "@/config/app.config";
import { useTranslation } from "@/lib/i18n/client";
import { useAdminStore } from "@/lib/stores/admin.store";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { resolveIcon } from "./icon-registry";

export function AdminSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const collapsed = useAdminStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useAdminStore((state) => state.toggleSidebar);
  const setActivePath = useAdminStore((state) => state.setActivePath);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const brandHref = appConfig.navigation[0]?.href ?? "/admin";

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col border-r bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && <BrandLogo href={brandHref} />}
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 hover:bg-accent"
          aria-label={collapsed ? t("admin.sidebar.expand") : t("admin.sidebar.collapse")}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {appConfig.navigation.map((item) => {
          const children = "children" in item && item.children ? item.children : undefined;
          const SectionIcon = resolveIcon(item.icon);
          return (
            <div key={item.id}>
              {children && children.length > 0 ? (
                <div className="space-y-1">
                  {!collapsed && (
                    <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                      {item.icon && <SectionIcon className="h-4 w-4" />}
                      {t(item.labelKey)}
                    </div>
                  )}
                  {children.map((child) => {
                    const Icon = resolveIcon(child.icon);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setActivePath(child.href)}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                          isActive(child.href) && "bg-accent font-semibold",
                          collapsed && "justify-center",
                        )}
                        title={collapsed ? t(child.labelKey) : undefined}
                      >
                        {collapsed ? (
                          child.href.split("/").pop()?.charAt(0).toUpperCase()
                        ) : (
                          <>
                            {child.icon && <Icon className="h-4 w-4 shrink-0" />}
                            {t(child.labelKey)}
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Link
                  key={item.href ?? item.id}
                  href={item.href ?? "/admin"}
                  onClick={() => setActivePath(item.href ?? "/admin")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                    isActive(item.href ?? "/admin") && "bg-accent font-semibold",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? t(item.labelKey) : undefined}
                >
                  {collapsed ? (
                    t(item.labelKey).charAt(0)
                  ) : (
                    <>
                      {item.icon && <SectionIcon className="h-4 w-4 shrink-0" />}
                      {t(item.labelKey)}
                    </>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t p-2">
        <LocaleSwitcher />
      </div>
      <div className="border-t p-2">
        <ThemeSwitcher />
      </div>
    </aside>
  );
}
