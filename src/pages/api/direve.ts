import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var CryptoJS = require("crypto-js");
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not permited" });
  }

  const key = process.env.DIREV_API_KEY;
  var bytesToKey = CryptoJS.AES.decrypt(key, process.env.SECRET);
  var originalKey = bytesToKey.toString(CryptoJS.enc.Utf8);

  const { query } = req.body;
  const { lang } = req.body;
  const { count } = req.body;

  try {
    const response = await axios.get(
      `${process.env.DIREV_API_URL}/search/?${query ? `q=${query}` : ""}&lang=${
        lang ? lang : "en"
      }&format=json&count=${count ? count : 10}`,
      { headers: { apiKey: originalKey } }
    );
    return res.status(200).json({ data: response.data, status: true });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail || "Erro while searching events";
    return res.status(200).json({ message: error, status: false });
  }
}
