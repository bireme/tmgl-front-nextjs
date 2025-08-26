import { ArticleDTO } from "../types/rssFeedTypes";
import Cookies from "js-cookie";
import axios from "axios";

export async function FetchRSSFeed(
  from: number,
  count: number,
  page: number,
  queryString?: string,
  filter?: string
): Promise<Array<ArticleDTO>> {
  try {
    const cookieLang = Cookies.get("lang");
    const lang = cookieLang ? cookieLang : "en";
    const response = await axios.get("/api/rssfeed", {
      params: {
        lang,
        from,
        count,
        page,
        queryString,
        filter: normalizeFilter(filter),
      },
    });
    let feedItems = response.data.rss.channel.item || [];

    if (feedItems.length === 0) {
      feedItems.push(response.data.rss.channel);
    }
    return feedItems;
  } catch (error) {
    console.error("Error while searching RSS FEED by Client Service:", error);
    throw new Error("Error while searching RSS FEED by Client Service");
  }
}

function normalizeFilter(input?: string): string | undefined {
  if (!input) return undefined;

  let cleaned = input;

  try {
    // Tenta decodificar uma vez (se já vier como `%26amp%3B...`)
    cleaned = decodeURIComponent(cleaned);
  } catch (_) {
    // Ignora erro se já estiver decodificado
  }

  // Substitui HTML entities por & reais, caso venham do painel
  cleaned = cleaned.replace(/&amp;/g, "&");

  return cleaned;
}
