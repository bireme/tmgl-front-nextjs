import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";
import { parseStringPromise } from "xml2js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { lang, from, count, page, queryString, filter } = req.query;
    const feedUrl = process.env.RSS_FEED_URL ? process.env.RSS_FEED_URL : "";
    let response;
    if (filter?.includes("lang=")) {
      response = await axios.get(feedUrl + filter, { responseType: "text" });
    } else {
      response = await axios.get(
        feedUrl +
          `&lang=${lang}&from=${from}&count=${count}&page=${page}${
            filter ? filter : ""
          }${queryString ? `&q=${queryString}` : ""}`,
        { responseType: "text" }
      );
    }

    const xmlData = response.data;

    const jsonData = await parseStringPromise(xmlData, {
      explicitArray: false,
    });

    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Error while searching RSS FEED:", error);
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
  }
}
