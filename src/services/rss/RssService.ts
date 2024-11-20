import { ArticleDTO } from "../types/rssFeedTypes";
import Cookies from "js-cookie";
import axios from "axios";

export async function FetchRSSFeed(
  from: number,
  count: number,
  page: number,
  queryString?: string
): Promise<Array<ArticleDTO>> {
  try {
    const cookieLang = Cookies.get("lang");
    const lang = cookieLang ? cookieLang : "en";
    const response = await axios.get("/api/rssfeed", {
      params: { lang, from, count, page, queryString },
    });
    const feedItems = response.data.rss.channel.item || [];
    return feedItems;
  } catch (error) {
    console.error("Error while searching RSS FEED by Client Service:", error);
    throw new Error("Error while searching RSS FEED by Client Service");
  }
}
