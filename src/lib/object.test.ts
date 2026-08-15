import { describe, expect, it } from "vitest";
import { getByPath } from "./object";

describe("getByPath", () => {
  const data = {
    metrics: {
      users: { newUsersCount: 16, totalUsersCount: 16 },
    },
    trends: {
      users: [{ date: "2026-08-15", count: 16 }],
    },
    count: 42,
  };

  it("resolves a nested path", () => {
    expect(getByPath(data, "metrics.users.totalUsersCount")).toBe(16);
  });

  it("resolves a top-level path", () => {
    expect(getByPath(data, "count")).toBe(42);
  });

  it("returns undefined for a missing path", () => {
    expect(getByPath(data, "metrics.users.unknown")).toBeUndefined();
  });

  it("returns undefined for a non-object step", () => {
    expect(getByPath(data, "count.nested")).toBeUndefined();
  });

  it("returns undefined for nullish input", () => {
    expect(getByPath(null, "metrics")).toBeUndefined();
    expect(getByPath(undefined, "metrics")).toBeUndefined();
  });

  it("returns undefined for an empty path", () => {
    expect(getByPath(data, "")).toBeUndefined();
  });
});
