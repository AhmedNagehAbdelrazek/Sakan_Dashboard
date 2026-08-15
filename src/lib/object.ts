export function getByPath(target: unknown, path: string): unknown {
  if (target === null || target === undefined || path === "") {
    return undefined;
  }

  const segments = path.split(".");
  let current: unknown = target;

  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}
