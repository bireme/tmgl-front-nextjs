import { z } from "zod";
import { apiHandler, rateLimit } from "@/server/api";
import { hasThumbnail, thumbnailKey, thumbnailUrl } from "@/server/pdfThumbnails";

const input = z.object({ urls: z.array(z.string().max(4096)).min(1).max(100) });
export default apiHandler(["POST"], async (req, res) => {
  rateLimit(req, res, "thumbnail-check", 60);
  const { urls } = input.parse(req.body);
  const results = await Promise.all(urls.map(async (url) => {
    const key = thumbnailKey(url);
    return { url, exists: await hasThumbnail(key), thumbnail: thumbnailUrl(key) };
  }));
  return res.status(200).json({ status: true, results });
});

export const config = { api: { bodyParser: { sizeLimit: "512kb" } } };
