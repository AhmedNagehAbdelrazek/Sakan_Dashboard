import { z } from "zod";

export const apiEnvelopeSchema = z.object({
  status: z.enum(["success", "error"]),
  data: z.unknown().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  message: z.string().optional(),
});

export const dashboardMetricsSchema = z.object({
  totalUsers: z.number(),
  totalLandlords: z.number(),
  totalStudents: z.number(),
  totalProperties: z.number(),
  approvedProperties: z.number(),
  totalApplications: z.number(),
  pendingApplications: z.number(),
  totalPayments: z.number(),
  receivedPayments: z.number(),
  releasedPayments: z.number(),
  recentActivities: z.array(z.record(z.string(), z.unknown())).default([]),
});

export type DashboardMetricsData = z.infer<typeof dashboardMetricsSchema>;
