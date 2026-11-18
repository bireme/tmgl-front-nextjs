import { apiHandler, ApiError, rateLimit } from "@/server/api";
import { downloadPdf } from "@/server/remotePdf";

let active = 0;
export default apiHandler(["GET"], async (req, res) => {
  rateLimit(req, res, "pdf-proxy", 60);
  if (active >= 4) throw new ApiError(503, "PDF_BUSY", "We couldn't open this document right now. Please try again in a moment.");
  active++;
  try {
    const buffer = await downloadPdf(req.query.url);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="document.pdf"');
    res.setHeader("Content-Security-Policy", "sandbox");
    res.setHeader("Cache-Control", "private, max-age=300");
    return res.status(200).send(buffer);
  } finally { active--; }
});

export const config = { api: { responseLimit: "20mb" } };
