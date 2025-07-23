import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import crypto from "crypto";
import { fromBuffer } from "pdf2pic";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const THUMBS_DIR = path.join(process.cwd(), "public", "pdfs");
const DEFAULT_IMG = "/pdfs/default.png";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.method === "POST" ? req.body : req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL inválida" });
  }

  const hash = crypto.createHash("md5").update(url).digest("hex");
  const imgPath = path.join(THUMBS_DIR, `${hash}.png`);
  const imgPublic = `/pdfs/${hash}.png`;

  try {
    const outputPath = path.resolve(THUMBS_DIR);
    if (!fs.existsSync(THUMBS_DIR)) {
      fs.mkdirSync(THUMBS_DIR, { recursive: true });
    }

    if (fs.existsSync(imgPath)) {
      return res.status(200).json({ file: imgPublic });
    }

    // Baixa o PDF
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const pdfBuffer = response.data;

    const convert = fromBuffer(pdfBuffer, {
      density: 120,
      savePath: outputPath,
      saveFilename: hash + "_raw", // vai gerar: hash_raw_1.png
      format: "png",
      quality: 100,
    });

    const pageNumber = 1;
    await convert(pageNumber);

    const rawFile = path.join(THUMBS_DIR, `${hash}_raw.${pageNumber}.png`);

    const finalFile = path.join(THUMBS_DIR, `${hash}.png`);

    // Redimensiona mantendo o aspecto
    await sharp(rawFile).resize({ width: 400 }).toFile(finalFile);

    fs.unlinkSync(rawFile);

    return res.status(200).json({ file: imgPublic });
  } catch (err) {
    console.error("Erro ao gerar thumbnail:", err);
    return res.status(200).json({ file: DEFAULT_IMG });
  }
}
