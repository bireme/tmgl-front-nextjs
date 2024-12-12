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
  const { query, count, q, start } = req.body;
  const apiKey = decryptFromEnv(
    process.env.DIREV_API_KEY ? process.env.DIREV_API_KEY : ""
  );

  try {
    if (!process.env.JOURNALS_API_URL)
      throw new Error("LIS_API_URL not defined");
    const url = `${process.env.JOURNALS_API_URL}search/${
      query ? `?fq=${query}&` : "?"
    }${count ? `count=${count}` : ""}${q ? `&q=${q}` : ""}${
      start ? `&start=${start}` : ""
    }`;
    const response = await axios.get(url, { headers: { apiKey: apiKey } });
    return res.status(200).json({ data: response.data, status: true });
  } catch (error) {
    console.error("Error while fecthing JOURNALS resources:");
  }
}
