import axios from "axios";
import { z } from "zod";
import { parseStringPromise } from "xml2js";
import { apiHandler, ApiError, requiredEnv } from "@/server/api";

const input = z.object({
  lang: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/).default("en"),
  from: z.coerce.number().int().min(0).max(1000000).default(0),
  count: z.coerce.number().int().min(1).max(100).default(10),
  page: z.coerce.number().int().min(0).max(100000).default(1),
  queryString: z.string().max(4000).optional(),
  filter: z.string().max(16000).optional(),
});

export default apiHandler(["GET"], async (req, res) => {
  const params = input.parse(req.query);
  const url = new URL(requiredEnv("RSS_FEED_URL"));
  const filter = new URLSearchParams(params.filter?.replace(/^&/, ""));
  if (!filter.has("lang")) {
    for (const name of ["lang", "from", "count", "page"] as const) url.searchParams.set(name, String(params[name]));
  }
  // Filters may customize the query, never the origin, path or download limits.
  for (const [name, value] of filter) url.searchParams.set(name, value);
  if (params.queryString) url.searchParams.set("q", params.queryString);
  input.parse(Object.fromEntries(url.searchParams));
  const response = await axios.get(url.href, { responseType: "text", timeout: 15000, maxRedirects: 0, maxContentLength: 2 * 1024 * 1024 });
  if (typeof response.data !== "string" || /<!DOCTYPE|<!ENTITY/i.test(response.data)) {
    throw new ApiError(502, "INVALID_FEED", "We couldn't load these updates right now. Please try again later.");
  }
  let data;
  try { data = await parseStringPromise(response.data, { explicitArray: false }); }
  catch { throw new ApiError(502, "INVALID_FEED", "We couldn't load these updates right now. Please try again later."); }
  if (!data?.rss?.channel) throw new ApiError(502, "INVALID_FEED", "We couldn't load these updates right now. Please try again later.");
  return res.status(200).json(data);
});
