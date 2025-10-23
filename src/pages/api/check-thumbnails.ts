import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import SparkMD5 from "spark-md5";

const THUMBS_DIR = path.join(process.cwd(), "public", "pdfs");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { urls } = req.body;

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: "URLs array is required" });
  }

  try {
    const results = urls.map((url: string) => {
      const hash = SparkMD5.hash(url);
      const imgPath = path.join(THUMBS_DIR, `${hash}.png`);
      const imgPublic = `/pdfs/${hash}.png`;
      
      return {
        url,
        exists: fs.existsSync(imgPath),
        thumbnail: imgPublic
      };
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error("Error checking thumbnails:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
