import type { AppConfig } from "./app.config.schema";

export const appConfig: AppConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  },
  auth: {
    cookieName: "access_token",
    refreshCookieName: "refresh_token",
  },
  theme: {
    storageKey: "theme-preference",
    defaultPalette: "default",
    defaultMode: "light",
  },
  i18n: {
    storageKey: "locale-preference",
    defaultLocale: "en",
  },
  branding: {
    name: "My Dashboard",
    logoPath: null,
    palette: "default",
    defaultLocale: "en",
  },
  navigation: [
    {
      id: "dashboard",
      labelKey: "admin.sidebar.dashboard",
      href: "/admin",
      icon: "layout-dashboard",
    },
    {
      id: "general",
      labelKey: "admin.sidebar.general",
      href: null,
      icon: null,
      children: [
        {
          href: "/admin/settings",
          labelKey: "admin.sidebar.settings",
          icon: null,
        },
      ],
    },
  ],
  dashboard: {
    defaultDateRangeDays: 30,
    widgets: [
      {
        id: "total-value",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalValue",
        source: "/api/dashboard/sample?kind=total-value&from={from}&to={to}",
        options: { field: "total_value", format: "currency" },
      },
      {
        id: "trend-chart",
        type: "chart",
        titleKey: "dashboard.widgets.trend",
        source: "/api/dashboard/sample?kind=trend",
        options: {
          chartType: "line",
          xField: "period",
          yFields: ["value"],
        },
      },
      {
        id: "top-list",
        type: "ranked-list",
        titleKey: "dashboard.widgets.topItems",
        source: "/api/dashboard/sample?kind=top-items",
        options: {
          rankField: "rank",
          labelField: "label",
          valueFields: [{ key: "value", format: "number" }],
        },
      },
    ],
  },
  formatting: {
    currency: { code: "EGP", locale: "ar-EG" },
    numberLocale: "en-US",
    dateFormat: "yyyy-MM-dd",
  },
};

export function validateConfig(): void {
  if (typeof window === "undefined") return;

  const required = ["NEXT_PUBLIC_API_URL"] as const;

  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`[Config] Missing environment variable: ${key}`);
    }
  }
}
