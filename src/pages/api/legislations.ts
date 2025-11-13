import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import { decryptFromEnv } from "@/helpers/crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(405).json({ message: "Method not permited" });
  }

  const { query, count, q, start, id, lang } = req.body;
  const apiKey = decryptFromEnv(
    process.env.BVSALUD_API_KEY ? process.env.BVSALUD_API_KEY : ""
  );

  try {
    if (!process.env.BVSALUD_URL) throw new Error("BVSALUD_URL not defined");
    let baseUrl = process.env.BVSALUD_URL;
    if (id) {
      let response = await getLegislationsItem(
        id,
        baseUrl,
        apiKey,
        lang ? lang : "en"
      );
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      if (response)
        return res.status(200).json({ data: response.data, status: true });
      return res.status(404).json({ data: {}, status: false });
    } else {
      let response = await getLegislation(
        query,
        count,
        q,
        start,
        baseUrl,
        apiKey,
        lang ? lang : "en"
      );
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      if (response)
        return res.status(200).json({ data: response.data, status: true });
      return res.status(404).json({ data: {}, status: false });
    }
  } catch (error) {
    console.error("Error while fecthing Legislations resources:", error);
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    return res.status(400).json({ data: {}, status: false });
  }
}

async function getLegislationsItem(
  id: string,
  baseUrl: string,
  apiKey: string,
  lang: string
) {
  baseUrl += `leisref/v1/${id}/?format=json&lang=${lang}`;
  const response = await axios.get(baseUrl, { headers: { apiKey: apiKey } });
  return response;
}
async function getLegislation(
  query: string,
  count: number,
  q: string,
  start: number,
  baseUrl: string,
  apiKey: string,
  lang: string
) {
  baseUrl += "leisref/v1/";

  const url = `${baseUrl}search/${query ? `?fq=${query}&` : "?"}${
    count ? `count=${count}` : ""
  }${q ? `&q=${q}` : ""}${start ? `&start=${start}` : ""}&lang=${lang}`;

  const response = await axios.get(url, { headers: { apiKey: apiKey } });
  return response;
}
