import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET } from "./route";

async function fetchSample(query: string) {
  const request = new NextRequest(
    `http://localhost:3000/api/dashboard/sample?${query}`,
  );
  const response = await GET(request);
  return { status: response.status, body: await response.json() };
}

describe("GET /api/dashboard/sample", () => {
  it("returns the stat-card shape for kind=total-value", async () => {
    const { status, body } = await fetchSample("kind=total-value");
    expect(status).toBe(200);
    expect(body.status).toBe("success");
    expect(typeof body.data.total_value).toBe("number");
  });

  it("returns an array of points for kind=trend", async () => {
    const { status, body } = await fetchSample("kind=trend");
    expect(status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.data[0].period).toBe("string");
    expect(typeof body.data[0].value).toBe("number");
  });

  it("returns ranked entries for kind=top-items", async () => {
    const { status, body } = await fetchSample("kind=top-items");
    expect(status).toBe(200);
    expect(body.data[0]).toMatchObject({ rank: 1, label: "Item A" });
  });

  it("returns an error envelope for an unknown kind", async () => {
    const { status, body } = await fetchSample("kind=bogus");
    expect(status).toBe(400);
    expect(body.status).toBe("error");
    expect(body.message).toBeTruthy();
  });
});
