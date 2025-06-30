import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import { decryptFromEnv } from "@/helpers/crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not permited" });
  }

  const { query, count, q, start, lang } = req.body;
  const apiKey = decryptFromEnv(
    process.env.BVSALUD_API_KEY ? process.env.BVSALUD_API_KEY : ""
  );

  try {
    if (!process.env.BVSALUD_URL) throw new Error("BVSALUD_URL not defined");
    let baseUrl = process.env.BVSALUD_URL;
    baseUrl += "event/v1/";

    const url = `${baseUrl}search/${query ? `?fq=${query}&` : "?"}${
      count ? `count=${count}` : ""
    }${q ? `&q=${q}` : ""}${start ? `&start=${start}` : ""}&lang=${lang}`;

    const response = await axios.get(url, { headers: { apiKey: apiKey } });
    return res.status(200).json({ data: response.data, status: true });
  } catch (error) {
    console.error("Error while fecthing LIS resources:");
  }
}
