import { z } from "zod";
import {
  dashboardWidgetConfigSchema,
} from "@/features/dashboard/schemas/widget-config.schema";

export const paletteNameSchema = z.enum(["default", "ocean", "forest"]);
export const themeModeSchema = z.enum(["light", "dark"]);
export const localeCodeSchema = z.enum(["en", "ar"]);

export const apiConfigSchema = z.object({
  baseUrl: z.string().url("api.baseUrl must be a valid URL"),
});

export const authConfigSchema = z.object({
  cookieName: z.string().min(1, "auth.cookieName must not be empty"),
  refreshCookieName: z.string().min(1, "auth.refreshCookieName must not be empty"),
});

export const themeConfigSchema = z.object({
  storageKey: z.string().min(1),
  defaultPalette: paletteNameSchema,
  defaultMode: themeModeSchema,
});

export const i18nConfigSchema = z.object({
  storageKey: z.string().min(1),
  defaultLocale: localeCodeSchema,
});

export const brandingConfigSchema = z.object({
  name: z.string().min(1, "branding.name must not be empty"),
  logoPath: z
    .string()
    .nullable()
    .refine(
      (p) =>
        p === null ||
        (p.startsWith("/") && !p.includes("..") && !p.includes("\\")),
      "branding.logoPath must be an absolute public asset path starting with / (e.g. /logo.svg)",
    ),
  palette: paletteNameSchema,
  defaultLocale: localeCodeSchema,
});

export const navigationItemSchema = z.object({
  href: z.string().min(1, "navigation item href must not be empty"),
  labelKey: z.string().min(1, "navigation item labelKey must not be empty"),
  icon: z.string().nullable(),
});

export const navigationSectionSchema = z.object({
  id: z.string().min(1, "navigation section id must not be empty"),
  labelKey: z.string().min(1, "navigation section labelKey must not be empty"),
  href: z.string().min(1).nullable(),
  icon: z.string().nullable(),
  children: z.array(navigationItemSchema).optional(),
});

export const navigationConfigSchema = z
  .array(navigationSectionSchema)
  .min(1, "navigation must contain at least one entry")
  .superRefine((sections, ctx) => {
    const seen = new Set<string>();
    sections.forEach((section, index) => {
      if (seen.has(section.id)) {
        ctx.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `navigation section id "${section.id}" is duplicated`,
        });
      }
      seen.add(section.id);

      const hasChildren = section.children && section.children.length > 0;
      if (hasChildren && section.href) {
        ctx.addIssue({
          code: "custom",
          path: [index, "href"],
          message: `navigation section "${section.id}" has children so href must be null`,
        });
      }
      if (!hasChildren && !section.href) {
        ctx.addIssue({
          code: "custom",
          path: [index, "href"],
          message: `navigation section "${section.id}" has no children so href is required`,
        });
      }
    });
  });

export const formattingConfigSchema = z.object({
  currency: z.object({
    code: z.string().min(1, "formatting.currency.code must not be empty"),
    locale: z.string().min(1, "formatting.currency.locale must not be empty"),
  }),
  numberLocale: z.string().min(1, "formatting.numberLocale must not be empty"),
  dateFormat: z.string().min(1, "formatting.dateFormat must not be empty"),
});

export const dashboardConfigSchema = z.object({
  defaultDateRangeDays: z.number().int().positive(),
  widgets: z.array(dashboardWidgetConfigSchema),
});

export const appConfigSchema = z.object({
  api: apiConfigSchema,
  auth: authConfigSchema,
  theme: themeConfigSchema,
  i18n: i18nConfigSchema,
  branding: brandingConfigSchema,
  navigation: navigationConfigSchema,
  dashboard: dashboardConfigSchema,
  formatting: formattingConfigSchema,
});

export type AppConfig = z.infer<typeof appConfigSchema>;
export type NavigationSection = z.infer<typeof navigationSectionSchema>;
export type NavigationItem = z.infer<typeof navigationItemSchema>;

export function validateAppConfig(config: unknown): AppConfig {
  const result = appConfigSchema.safeParse(config);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid app config: ${issues}`);
  }
  return result.data;
}
