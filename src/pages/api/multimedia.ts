import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not permited" });
  }

  const { offset, lang, q, fq } = req.body;

  try {
    if (!process.env.FIADMIN_URL) throw new Error("FIADMIN_URL not defined");
    let baseUrl = process.env.FIADMIN_URL;
    let response = await getItems(baseUrl, fq, q, lang);
    if (response)
      return res.status(200).json({ data: response.data, status: true });
    return res.status(404).json({ data: {}, status: false });
  } catch (error) {
    console.error("Error while fecthing Multimedia resources:", error);
    return res.status(400).json({ data: {}, status: false });
  }
}

async function getItems(baseUrl: string, fq: string, q: string, lang: string) {
  baseUrl += "/multimedia/search/";
  const url = `${baseUrl}?lang=${lang}&q=${q}&fq=${fq}&sort=created_date%20desc`;
  const response = await axios.get(url);
  return response;
}
