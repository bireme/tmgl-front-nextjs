import axios from "axios";
import { z } from "zod";
import { decryptFromEnv } from "@/helpers/crypto";
import { apiHandler, ApiError, requiredEnv } from "./api";

const input = z.object({
  query: z.string().max(16000).optional(),
  q: z.string().max(4000).optional(),
  count: z.number().int().min(1).max(10000).default(10),
  start: z.number().int().min(0).max(1000000).default(0),
  id: z.union([z.string().regex(/^\d{1,20}$/), z.number().int().nonnegative()]).optional(),
  lang: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/).default("en"),
});

type RepositoryOptions = { baseEnv?: string; endpoint?: string; keyEnv?: string; sort?: string; items?: boolean };

export function repositoryHandler(options: RepositoryOptions) {
  return apiHandler(["POST"], async (req, res) => {
    const params = input.parse(req.body);
    if (params.id !== undefined && !options.items) throw new ApiError(400, "INVALID_INPUT", "We couldn't find this content. Please return to the list and try again.");
    const base = requiredEnv(options.baseEnv || "BVSALUD_URL");
    const headers: Record<string, string> = {};
    if (options.keyEnv) {
      const key = decryptFromEnv(requiredEnv(options.keyEnv));
      if (!key) throw new ApiError(500, "CONFIGURATION_ERROR", "This feature isn't available right now. Please try again later.");
      headers.apiKey = key;
    }
    const endpoint = options.endpoint ? `${options.endpoint.replace(/^\/+|\/+$/g, "")}/` : "";
    const url = new URL(`${endpoint}${params.id !== undefined ? `${params.id}/` : "search/"}`, `${base.replace(/\/+$/, "")}/`);
    url.searchParams.set("lang", params.lang);
    if (params.id !== undefined) url.searchParams.set("format", "json");
    else {
      url.searchParams.set("count", String(params.count));
      url.searchParams.set("start", String(params.start));
      if (params.query) url.searchParams.set("fq", params.query);
      if (params.q) url.searchParams.set("q", params.q);
      if (options.sort) url.searchParams.set("sort", options.sort);
    }
    const response = await axios.get(url.href, {
      headers, timeout: 20000, maxContentLength: 10 * 1024 * 1024,
      // Never forward credentials to a redirect destination.
      maxRedirects: 0,
    });
    if (!response.data || typeof response.data !== "object") throw new ApiError(502, "INVALID_UPSTREAM_RESPONSE", "We couldn't load this content right now. Please try again later.");
    return res.status(200).json({ data: response.data, status: true });
  });
}
