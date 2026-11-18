import axios from "axios";
import { z } from "zod";
import { apiHandler, ApiError, rateLimit } from "@/server/api";

const cache = new Map<string, { thumbnail: string; expires: number }>();
const input = z.object({ url: z.url().max(4096) });
export default apiHandler(["GET", "POST"], async (req, res) => {
  rateLimit(req, res, "video-thumbnail", 120);
  const { url } = input.parse(req.method === "POST" ? req.body : req.query);
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new ApiError(400, "INVALID_URL", "We couldn't open this video. Please check the link.");
  }
  const now = Date.now();
  for (const [key, value] of cache) if (value.expires <= now) cache.delete(key);
  const cached = cache.get(url);
  if (cached) return res.status(200).json({ status: true, thumbnail: cached.thumbnail });
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  let thumbnail = "/local/jpeg/multimedia.jpg";
  if (["youtube.com", "m.youtube.com", "youtu.be"].includes(host)) {
    const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) throw new ApiError(400, "INVALID_URL", "We couldn't find this video. Please check the link.");
    thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } else if (["vimeo.com", "player.vimeo.com"].includes(host)) {
    const id = parsed.pathname.split("/").filter(Boolean).pop();
    if (!id || !/^\d+$/.test(id)) throw new ApiError(400, "INVALID_URL", "We couldn't find this video. Please check the link.");
    const response = await axios.get("https://vimeo.com/api/oembed.json", {
      params: { url: `https://vimeo.com/${id}` }, timeout: 5000, maxRedirects: 0, maxContentLength: 128 * 1024,
    });
    const candidate = response.data?.thumbnail_url;
    if (typeof candidate !== "string" || !candidate.startsWith("https://")) {
      throw new ApiError(502, "INVALID_UPSTREAM_RESPONSE", "We couldn't load the video preview. Please try again later.");
    }
    thumbnail = candidate;
  }
  if (cache.size >= 1000) cache.delete(cache.keys().next().value!);
  cache.set(url, { thumbnail, expires: now + 86400000 });
  return res.status(200).json({ status: true, thumbnail });
});
