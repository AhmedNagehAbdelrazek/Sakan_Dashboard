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
