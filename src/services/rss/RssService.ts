import { ArticleDTO } from "../types/rssFeedTypes";
import axios from "axios";
import { parseStringPromise } from "xml2js";

export async function FetchRSSFeed(
  lang: string,
  from: number,
  count: number,
  page: number
): Promise<Array<ArticleDTO>> {
  try {
    const response = await axios.get("/api/rssfeed", {
      params: { lang, from, count, page },
    });
    const feedItems = response.data.rss.channel.item || [];
    return feedItems;
  } catch (error) {
    console.error("Error while searching RSS FEED by Client Service:", error);
    throw new Error("Error while searching RSS FEED by Client Service");
  }
}
