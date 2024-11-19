// pages/api/subscribe.ts

import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

type Data = {
  message: string;
  status?: boolean;
  data?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not permited" });
  }
  var CryptoJS = require("crypto-js");
  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is a required field" });
  }

  if (process.env.MAILCHIMP_API_KEY && process.env.SECRET) {
    var bytesToKey = CryptoJS.AES.decrypt(
      process.env.MAILCHIMP_API_KEY,
      process.env.SECRET
    );
    var originalKey = bytesToKey.toString(CryptoJS.enc.Utf8);
  } else {
    return res.status(500).json({ message: "MailChimp Config not found" });
  }

  const API_KEY = originalKey;
  const LIST_ID = process.env.MAILCHIMP_LIST_ID;
  const DATA_CENTER = process.env.MAILCHIMP_DATA_CENTER;
  if (!API_KEY || !LIST_ID || !DATA_CENTER) {
    return res.status(500).json({ message: "MailChimp Config not found" });
  }
  const url = `https://${DATA_CENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;
  try {
    const response = await axios.post(
      url,
      { email_address: email, status: "pending" },
      { headers: { Authorization: `apikey ${API_KEY}` } }
    );

    return res.status(200).json({
      message: "Subscribed successfully",
      status: true,
      data: response.data,
    });
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail || "Erro while subscribing";
    return res.status(200).json({ message: errorMessage, status: false });
  }
}
