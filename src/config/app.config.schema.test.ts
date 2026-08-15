import { describe, expect, it } from "vitest";
import { appConfig } from "./app.config";
import { appConfigSchema, validateAppConfig } from "./app.config.schema";

describe("appConfigSchema", () => {
  it("accepts the shipped app config", () => {
    const parsed = appConfigSchema.safeParse(appConfig);
    expect(parsed.success).toBe(true);
  });

  it("rejects a widget source that is not a local API route", () => {
    const bad = {
      ...appConfig,
      dashboard: {
        ...appConfig.dashboard,
        widgets: [{ ...appConfig.dashboard.widgets[0], source: "https://example.com/data" }],
      },
    };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });

  it("rejects an unknown widget type", () => {
    const bad = {
      ...appConfig,
      dashboard: {
        ...appConfig.dashboard,
        widgets: [{ ...appConfig.dashboard.widgets[0], type: "pie" }],
      },
    };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });

  it("rejects an empty branding name", () => {
    const bad = { ...appConfig, branding: { ...appConfig.branding, name: "" } };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });

  it("accepts a valid absolute logoPath", () => {
    const ok = { ...appConfig, branding: { ...appConfig.branding, logoPath: "/logo.svg" } };
    const parsed = appConfigSchema.safeParse(ok);
    expect(parsed.success).toBe(true);
  });

  it("rejects a relative logoPath", () => {
    const bad = { ...appConfig, branding: { ...appConfig.branding, logoPath: "logo.svg" } };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });

  it("rejects a logoPath with path traversal", () => {
    const bad = {
      ...appConfig,
      branding: { ...appConfig.branding, logoPath: "/../secrets" },
    };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });

  it("rejects duplicate navigation section ids", () => {
    const bad = {
      ...appConfig,
      navigation: [appConfig.navigation[0], { ...appConfig.navigation[0] }],
    };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });

  it("rejects a navigation section that has both children and an href", () => {
    const groupSection = {
      id: "group",
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
    };
    const bad = {
      ...appConfig,
      navigation: [
        {
          ...groupSection,
          href: "/admin/settings",
        },
      ],
    };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });

  it("rejects a navigation section without children and without href", () => {
    const bad = {
      ...appConfig,
      navigation: [
        {
          id: "orphan",
          labelKey: "admin.sidebar.general",
          icon: null,
          href: null,
        },
      ],
    };
    const parsed = appConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(false);
  });
});

describe("validateAppConfig", () => {
  it("returns the parsed config for a valid input", () => {
    expect(validateAppConfig(appConfig).branding.name).toBe(appConfig.branding.name);
  });

  it("throws a descriptive error for invalid input", () => {
    expect(() =>
      validateAppConfig({ ...appConfig, branding: { ...appConfig.branding, name: "" } }),
    ).toThrow(/branding\.name/);
  });
});
