import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { proxyErrorResponse, proxyGet } from "@/lib/api/proxy";

interface RecentActivityRow {
  rank: number;
  label: string;
  value: number;
}

export async function GET(req: NextRequest) {
  try {
    const data = await proxyGet<{ recentActivities?: Array<Record<string, unknown>> }>(
      req,
      "/api/admin/dashboard",
    );
    const activities = data.recentActivities ?? [];

    const counts = new Map<string, number>();
    for (const activity of activities) {
      const type =
        typeof activity.activityType === "string" ? activity.activityType : "activity";
      counts.set(type, (counts.get(type) ?? 0) + 1);
    }

    const rows: RecentActivityRow[] = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([label, value], index) => ({ rank: index + 1, label, value }));

    return NextResponse.json({ status: "success", data: rows });
  } catch (error) {
    return proxyErrorResponse(error);
  }
}
