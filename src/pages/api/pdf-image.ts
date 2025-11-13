import { NextApiRequest, NextApiResponse } from "next";

import { PDFDocument } from "pdf-lib";
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
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
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
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      return res.status(200).json({ file: imgPublic });
    }

    // Baixa o PDF com timeout maior e retry
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 5000, // Aumentado de 1000 para 5000ms
      maxRedirects: 5,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TMGL-Thumbnail-Generator/1.0)',
      },
    });
    const pdfBuffer = response.data;

    // 📐 Usa pdf-lib para detectar proporção da primeira página
    const doc = await PDFDocument.load(pdfBuffer);
    const firstPage = doc.getPage(0);
    const { width: pageWidth, height: pageHeight } = firstPage.getSize();

    // 🧠 Calcula tamanho proporcional baseado em altura 1000px
    const renderHeight = 1000;
    const renderWidth = Math.round((pageWidth / pageHeight) * renderHeight);

    const convert = fromBuffer(pdfBuffer, {
      density: 100, // Reduzido de 120 para 100 para processar mais rápido
      savePath: outputPath,
      saveFilename: hash + "_raw",
      format: "png",
      quality: 70, // Reduzido de 80 para 70 para arquivos menores
      width: renderWidth,
      height: renderHeight,
    });

    await convert(1);

    const rawFile = path.join(THUMBS_DIR, `${hash}_raw.1.png`);
    const finalFile = path.join(THUMBS_DIR, `${hash}.png`);

    // 📸 Recorta thumbnail 400x300 do topo da imagem renderizada (menor para carregar mais rápido)
    const targetWidth = 400;
    const targetHeight = 300;

    const image = sharp(rawFile);
    const resized = await image.resize({ height: targetHeight }).toBuffer();
    const resizedMeta = await sharp(resized).metadata();

    const cropLeft = Math.max(
      0,
      Math.floor(((resizedMeta.width ?? targetWidth) - targetWidth) / 2)
    );

    if ((resizedMeta.width ?? 0) >= targetWidth) {
      await sharp(resized)
        .extract({
          left: cropLeft,
          top: 0,
          width: targetWidth,
          height: targetHeight,
        })
        .toFile(finalFile);
    } else {
      // fallback: só redimensiona e salva como está
      await sharp(resized).toFile(finalFile);
    }

    opcional: fs.unlinkSync(rawFile);

    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(200).json({ file: imgPublic });
  } catch (err) {
    console.error("Erro ao gerar thumbnail:", err);
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(200).json({ file: DEFAULT_IMG });
  }
}
