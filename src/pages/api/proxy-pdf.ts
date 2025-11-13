import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url, type } = req.query;

  if (!url || typeof url !== "string") {
    return fallback(res);
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/pdf",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      console.error(`Erro ao buscar PDF: ${response.status}`);
      return fallback(res);
    }

    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="proxy.pdf"');
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error(`Erro no proxy PDF: ${err}`);
    return fallback(res, type?.toString());
  }
}

// HTML com imagem fallback:
function fallback(res: NextApiResponse, type?: string) {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.status(200).send(`
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="/local/png/${type || "pdf"}.png" alt="PDF indisponível">
      </body>
    </html>
  `);
}
