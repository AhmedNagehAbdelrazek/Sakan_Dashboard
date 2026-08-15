export interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  meta?: Record<string, unknown>;
  message?: string;
}

export type WidgetRecord = Record<string, string | number>;
export type ChartDataPoint = WidgetRecord;
export type RankedListItem = WidgetRecord;
export type BreakdownSlice = WidgetRecord;

export interface DashboardMetrics {
  totalUsers: number;
  totalLandlords: number;
  totalStudents: number;
  totalProperties: number;
  approvedProperties: number;
  totalApplications: number;
  pendingApplications: number;
  totalPayments: number;
  receivedPayments: number;
  releasedPayments: number;
  recentActivities: Array<Record<string, unknown>>;
}
