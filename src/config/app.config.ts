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
        id: "total-users",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalUsers",
        source: "/api/admin/dashboard",
        options: { field: "totalUsers", format: "number" },
      },
      {
        id: "total-landlords",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalLandlords",
        source: "/api/admin/dashboard",
        options: { field: "totalLandlords", format: "number" },
      },
      {
        id: "total-students",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalStudents",
        source: "/api/admin/dashboard",
        options: { field: "totalStudents", format: "number" },
      },
      {
        id: "total-properties",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalProperties",
        source: "/api/admin/dashboard",
        options: { field: "totalProperties", format: "number" },
      },
      {
        id: "approved-properties",
        type: "stat-card",
        titleKey: "dashboard.kpis.approvedProperties",
        source: "/api/admin/dashboard",
        options: { field: "approvedProperties", format: "number" },
      },
      {
        id: "total-applications",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalApplications",
        source: "/api/admin/dashboard",
        options: { field: "totalApplications", format: "number" },
      },
      {
        id: "pending-applications",
        type: "stat-card",
        titleKey: "dashboard.kpis.pendingApplications",
        source: "/api/admin/dashboard",
        options: { field: "pendingApplications", format: "number" },
      },
      {
        id: "total-payments",
        type: "stat-card",
        titleKey: "dashboard.kpis.totalPayments",
        source: "/api/admin/dashboard",
        options: { field: "totalPayments", format: "number" },
      },
      {
        id: "received-payments",
        type: "stat-card",
        titleKey: "dashboard.kpis.receivedPayments",
        source: "/api/admin/dashboard",
        options: { field: "receivedPayments", format: "number" },
      },
      {
        id: "released-payments",
        type: "stat-card",
        titleKey: "dashboard.kpis.releasedPayments",
        source: "/api/admin/dashboard",
        options: { field: "releasedPayments", format: "number" },
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
