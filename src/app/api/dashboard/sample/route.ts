import { NextRequest, NextResponse } from "next/server";

const SAMPLE_DATA: Record<string, unknown> = {
  "total-value": {
    total_value: 48250.5,
  },
  trend: [
    { period: "2026-08-01", value: 1200 },
    { period: "2026-08-02", value: 1800 },
    { period: "2026-08-03", value: 1400 },
    { period: "2026-08-04", value: 2100 },
    { period: "2026-08-05", value: 1900 },
    { period: "2026-08-06", value: 2600 },
    { period: "2026-08-07", value: 2400 },
  ],
  "top-items": [
    { rank: 1, label: "Item A", value: 3400 },
    { rank: 2, label: "Item B", value: 2100 },
    { rank: 3, label: "Item C", value: 1750 },
    { rank: 4, label: "Item D", value: 980 },
  ],
  breakdown: [
    { label: "Cash", value: 15200 },
    { label: "Card", value: 11800 },
    { label: "Bank Transfer", value: 8400 },
  ],
};

export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind");
  const data = kind ? SAMPLE_DATA[kind] : undefined;

  if (!data) {
    return NextResponse.json(
      {
        status: "error",
        message:
          "Unknown sample data kind. Use kind=total-value|trend|top-items|breakdown.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json({ status: "success", data });
}
