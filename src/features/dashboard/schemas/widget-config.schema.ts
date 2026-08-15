import { z } from "zod";

const widgetSourceSchema = z
  .string()
  .regex(/^\//, "Widget source must be a local API route starting with '/'");

const baseWidgetSchema = {
  id: z.string().min(1, "Widget id must not be empty"),
  titleKey: z.string().min(1, "Widget titleKey must not be empty"),
  source: widgetSourceSchema,
};

const numberFormatSchema = z.enum(["number", "currency"]);

export const statCardOptionsSchema = z.object({
  field: z.string().min(1, "stat-card options.field must not be empty"),
  format: numberFormatSchema,
});

export const chartOptionsSchema = z.object({
  chartType: z.enum(["line", "bar", "area"]),
  dataPath: z
    .string()
    .optional()
    .describe("dot-path into the widget payload that points to the row array"),
  xField: z.string().min(1, "chart options.xField must not be empty"),
  yFields: z.array(z.string().min(1)).min(1, "chart options.yFields must not be empty"),
});

export const rankedListValueFieldSchema = z.object({
  key: z.string().min(1, "value field key must not be empty"),
  format: numberFormatSchema,
});

export const rankedListOptionsSchema = z.object({
  rankField: z.string().min(1, "ranked-list options.rankField must not be empty"),
  labelField: z.string().min(1, "ranked-list options.labelField must not be empty"),
  valueFields: z
    .array(rankedListValueFieldSchema)
    .min(1, "ranked-list options.valueFields must not be empty"),
});

export const breakdownOptionsSchema = z.object({
  dataPath: z
    .string()
    .optional()
    .describe("dot-path into the widget payload pointing to the row array or status object"),
  labelField: z.string().min(1, "breakdown options.labelField must not be empty"),
  valueField: z.string().min(1, "breakdown options.valueField must not be empty"),
  labelPrefix: z
    .string()
    .optional()
    .describe("i18n key prefix used to translate row labels (e.g. 'dashboard.status.application')"),
  format: numberFormatSchema,
});

export const statCardWidgetSchema = z.object({
  ...baseWidgetSchema,
  type: z.literal("stat-card"),
  options: statCardOptionsSchema,
});

export const chartWidgetSchema = z.object({
  ...baseWidgetSchema,
  type: z.literal("chart"),
  options: chartOptionsSchema,
});

export const rankedListWidgetSchema = z.object({
  ...baseWidgetSchema,
  type: z.literal("ranked-list"),
  options: rankedListOptionsSchema,
});

export const breakdownWidgetSchema = z.object({
  ...baseWidgetSchema,
  type: z.literal("breakdown"),
  options: breakdownOptionsSchema,
});

export const dashboardWidgetConfigSchema = z.discriminatedUnion("type", [
  statCardWidgetSchema,
  chartWidgetSchema,
  rankedListWidgetSchema,
  breakdownWidgetSchema,
]);

export type StatCardWidgetConfig = z.infer<typeof statCardWidgetSchema>;
export type ChartWidgetConfig = z.infer<typeof chartWidgetSchema>;
export type RankedListWidgetConfig = z.infer<typeof rankedListWidgetSchema>;
export type BreakdownWidgetConfig = z.infer<typeof breakdownWidgetSchema>;
export type DashboardWidgetConfig = z.infer<typeof dashboardWidgetConfigSchema>;
