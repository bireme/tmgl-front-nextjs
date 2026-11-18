/** Keep the configured search endpoint and encode the query as a single value. */
export function searchUrl(base: string | undefined, query: string): string {
  if (!base) throw new Error("Search is temporarily unavailable. Please try again later.");
  const url = new URL(base);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("Search is temporarily unavailable. Please try again later.");
  const value = query.trim();
  if (value) url.searchParams.set("q", value);
  else url.searchParams.delete("q");
  return url.href;
}
