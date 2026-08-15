import { describe, expect, it } from "vitest";
import { normalizeList } from "./normalize";

describe("normalizeList", () => {
  it("normalizes a bare array", () => {
    const result = normalizeList<{ id: number }>([{ id: 1 }, { id: 2 }]);
    expect(result.items).toHaveLength(2);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
  });

  it("normalizes an envelope with totalPages", () => {
    const result = normalizeList<{ id: number }>({
      items: [{ id: 1 }],
      page: 2,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
    expect(result.items).toHaveLength(1);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
  });

  it("computes totalPages when the envelope omits it", () => {
    const result = normalizeList<{ id: number }>({
      items: [{ id: 1 }],
      page: 1,
      limit: 10,
      total: 25,
    });
    expect(result.totalPages).toBe(3);
  });

  it("supplies defaults for an envelope without page/limit", () => {
    const result = normalizeList<{ id: number }>({ items: [{ id: 1 }], total: 1 }, {
      page: 4,
      limit: 5,
    });
    expect(result.page).toBe(4);
    expect(result.limit).toBe(5);
  });

  it("returns an empty list for unexpected input", () => {
    const result = normalizeList<unknown>(null);
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
  });
});
