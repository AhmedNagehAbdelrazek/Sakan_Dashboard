import type { AppConfig } from "./app.config.schema";

export const appConfig: AppConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
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
      id: "users",
      labelKey: "admin.sidebar.users",
      href: "/admin/users",
      icon: "users",
    },
    {
      id: "properties",
      labelKey: "admin.sidebar.properties",
      href: "/admin/properties",
      icon: "home",
    },
    {
      id: "applications",
      labelKey: "admin.sidebar.applications",
      href: "/admin/applications",
      icon: "clipboard-list",
    },
    {
      id: "payments",
      labelKey: "admin.sidebar.payments",
      href: "/admin/payments",
      icon: "tag",
    },
    {
      id: "activities",
      labelKey: "admin.sidebar.activities",
      href: "/admin/activities",
      icon: "activity",
    },
    {
      id: "flatmate-requests",
      labelKey: "admin.sidebar.flatmateRequests",
      href: "/admin/flatmate-requests",
      icon: "layers",
    },
    {
      id: "property-requests",
      labelKey: "admin.sidebar.propertyRequests",
      href: "/admin/property-requests",
      icon: "folder",
    },
    {
      id: "broadcast",
      labelKey: "admin.sidebar.broadcast",
      href: "/admin/broadcast",
      icon: "bell",
    },
  ],
  dashboard: {
    defaultDateRangeDays: 30,
    widgets: [
      {
        id: "total-users",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalUsers",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: { field: "metrics.users.totalUsersCount", format: "number" },
      },
      {
        id: "new-users",
        type: "stat-card",
        titleKey: "dashboard.kpis.newUsers",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: { field: "metrics.users.newUsersCount", format: "number" },
      },
      {
        id: "active-listings",
        type: "stat-card",
        titleKey: "dashboard.kpis.activeListings",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: {
          field: "metrics.properties.activeListingsCount",
          format: "number",
        },
      },
      {
        id: "new-listings",
        type: "stat-card",
        titleKey: "dashboard.kpis.newListings",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: {
          field: "metrics.properties.newListingsCount",
          format: "number",
        },
      },
      {
        id: "applications-by-status",
        type: "breakdown",
        titleKey: "dashboard.breakdown.applications",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: {
          dataPath: "metrics.applications.byStatus",
          labelField: "status",
          valueField: "count",
          labelPrefix: "dashboard.status.application",
          format: "number",
        },
      },
      {
        id: "payments-by-status",
        type: "breakdown",
        titleKey: "dashboard.breakdown.payments",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: {
          dataPath: "metrics.payments.byStatus",
          labelField: "status",
          valueField: "count",
          labelPrefix: "dashboard.status.payment",
          format: "number",
        },
      },
      {
        id: "users-trend",
        type: "chart",
        titleKey: "dashboard.trends.users",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: {
          chartType: "area",
          dataPath: "trends.users",
          xField: "date",
          yFields: ["count"],
        },
      },
      {
        id: "applications-trend",
        type: "chart",
        titleKey: "dashboard.trends.applications",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: {
          chartType: "area",
          dataPath: "trends.applications",
          xField: "date",
          yFields: ["count"],
        },
      },
      {
        id: "payments-trend",
        type: "chart",
        titleKey: "dashboard.trends.payments",
        source: "/api/admin/dashboard?from={from}&to={to}&limit={limit}",
        options: {
          chartType: "area",
          dataPath: "trends.payments",
          xField: "date",
          yFields: ["count"],
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
