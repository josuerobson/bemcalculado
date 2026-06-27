export function encodeParams(params: Record<string, string | number>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(key, String(value));
  }
  return searchParams.toString();
}

export function decodeParams(search: string): Record<string, string> {
  const cleaned = search.startsWith('?') ? search.slice(1) : search;
  const searchParams = new URLSearchParams(cleaned);
  const result: Record<string, string> = {};
  for (const [key, value] of searchParams.entries()) {
    result[key] = value;
  }
  return result;
}
