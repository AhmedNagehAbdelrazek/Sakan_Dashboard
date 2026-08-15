import { z } from "zod";

export const apiEnvelopeSchema = z.object({
  status: z.enum(["success", "error"]),
  data: z.unknown().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  message: z.string().optional(),
});

export const dashboardRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const dashboardUsersMetricsSchema = z.object({
  newUsersCount: z.number(),
  totalUsersCount: z.number(),
});

export const dashboardPropertiesMetricsSchema = z.object({
  activeListingsCount: z.number(),
  newListingsCount: z.number(),
});

export const dashboardStatusBreakdownSchema = z.object({
  byStatus: z.record(z.string(), z.number()),
});

export const dashboardTrendPointSchema = z.object({
  date: z.string(),
  count: z.number(),
});

export const dashboardTrendsSchema = z.object({
  users: z.array(dashboardTrendPointSchema),
  applications: z.array(dashboardTrendPointSchema),
  payments: z.array(dashboardTrendPointSchema),
});

export const dashboardNeedsAttentionSchema = z.object({
  applications: z.array(z.record(z.string(), z.unknown())).default([]),
  payments: z.array(z.record(z.string(), z.unknown())).default([]),
  propertyRequests: z.array(z.record(z.string(), z.unknown())).default([]),
  properties: z.array(z.record(z.string(), z.unknown())).default([]),
});

export const dashboardMetricsSchema = z.object({
  range: dashboardRangeSchema.optional(),
  metrics: z
    .object({
      users: dashboardUsersMetricsSchema,
      properties: dashboardPropertiesMetricsSchema,
      applications: dashboardStatusBreakdownSchema,
      payments: dashboardStatusBreakdownSchema,
    })
    .optional(),
  needsAttention: dashboardNeedsAttentionSchema.optional(),
  trends: dashboardTrendsSchema.optional(),
  meta: z.object({ limit: z.number().optional() }).optional(),
});

export type DashboardMetricsData = z.infer<typeof dashboardMetricsSchema>;
