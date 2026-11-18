import { apiHandler, rateLimit } from "@/server/api";
import { generateThumbnail, readThumbnail } from "@/server/pdfThumbnails";

export default apiHandler(["GET", "POST"], async (req, res) => {
  if (req.method === "GET" && typeof req.query.key === "string") {
    const image = await readThumbnail(req.query.key);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.status(200).send(image);
  }
  rateLimit(req, res, "pdf-thumbnail", 60);
  const url: unknown = req.method === "POST" ? req.body?.url : req.query.url;
  const file = await generateThumbnail(url);
  return res.status(200).json({ status: true, file });
});

export const config = { api: { bodyParser: { sizeLimit: "16kb" } } };
