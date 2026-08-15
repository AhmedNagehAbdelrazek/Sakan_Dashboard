export interface NormalizedList<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function normalizeList<T>(
  data: unknown,
  defaults: { page?: number; limit?: number } = {},
): NormalizedList<T> {
  const { page: defaultPage = 1, limit: defaultLimit = 20 } = defaults;

  if (Array.isArray(data)) {
    return {
      items: data as T[],
      page: defaultPage,
      limit: defaultLimit,
      total: data.length,
      totalPages: Math.max(1, Math.ceil(data.length / defaultLimit)),
    };
  }

  if (data && typeof data === "object" && !Array.isArray(data)) {
    const record = data as Record<string, unknown>;
    const items = Array.isArray(record.items) ? (record.items as T[]) : [];
    const total = typeof record.total === "number" ? record.total : items.length;
    const page = typeof record.page === "number" ? record.page : defaultPage;
    const limit = typeof record.limit === "number" ? record.limit : defaultLimit;
    const totalPages =
      typeof record.totalPages === "number"
        ? record.totalPages
        : Math.max(1, Math.ceil(total / limit));
    return { items, page, limit, total, totalPages };
  }

  return {
    items: [],
    page: defaultPage,
    limit: defaultLimit,
    total: 0,
    totalPages: 1,
  };
}
