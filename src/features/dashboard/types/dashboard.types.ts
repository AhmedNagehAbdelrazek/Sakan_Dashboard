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

export interface DashboardRange {
  from: string;
  to: string;
}

export interface DashboardUsersMetrics {
  newUsersCount: number;
  totalUsersCount: number;
}

export interface DashboardPropertiesMetrics {
  activeListingsCount: number;
  newListingsCount: number;
}

export interface DashboardStatusBreakdown {
  byStatus: Record<string, number>;
}

export interface DashboardNestedMetrics {
  users: DashboardUsersMetrics;
  properties: DashboardPropertiesMetrics;
  applications: DashboardStatusBreakdown;
  payments: DashboardStatusBreakdown;
}

export interface DashboardNeedsAttention {
  applications: Array<Record<string, unknown>>;
  payments: Array<Record<string, unknown>>;
  propertyRequests: Array<Record<string, unknown>>;
  properties: Array<Record<string, unknown>>;
}

export interface DashboardTrendPoint {
  date: string;
  count: number;
}

export interface DashboardTrends {
  users: DashboardTrendPoint[];
  applications: DashboardTrendPoint[];
  payments: DashboardTrendPoint[];
}

export interface DashboardMeta {
  limit?: number;
}

export interface DashboardMetrics {
  range?: DashboardRange;
  metrics?: DashboardNestedMetrics;
  needsAttention?: DashboardNeedsAttention;
  trends?: DashboardTrends;
  meta?: DashboardMeta;
}
