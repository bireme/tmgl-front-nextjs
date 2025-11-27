import * as he from "he";

import { MultLangStringAttr, queryType } from "@/services/types/resources";

export const parseWpLink = (wpLink: string, prefix?: string) => {
  return wpLink
    .replace(process.env.WP_BASE_URL ? process.env.WP_BASE_URL : "", "")
    .replace("/es/", "/")
    .replace("", "");
};

export function createUrlParametersFilter(
  queryItems: Array<queryType>
): string {
  let queryString = "";
  for (let i = 0; i < queryItems.length; i++) {
    if (i > 0 && queryItems[i - 1].parameter == queryItems[i].parameter) {
      queryString += `,${queryItems[i].query}`;
    } else {
      queryString += `&${queryItems[i].parameter}=${queryItems[i].query}`;
    }
  }
  return queryString;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase() // Converte para minúsculas
    .normalize("NFD") // Normaliza caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
    .trim() // Remove espaços extras no início e fim
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-"); // Remove hífens duplicados
}

export function getValueFromMultilangItem(
  lang: string,
  items: MultLangStringAttr[]
): string {
  let itemLang = items?.find((i) => i.lang === lang);
  if (itemLang) {
    return itemLang.content;
  } else {
    return items[0]?.content || "";
  }
}

export function removeHTMLTagsAndLimit(text: string, limit: number): string {
  const strippedText = text?.replace(/(<([^>]+)>)/gi, "");

  const truncatedText =
    strippedText.length > limit
      ? strippedText.substring(0, limit)
      : strippedText;
  return truncatedText.replace("[&hellip;]", "");
}
export function decodeHtmlEntities(text: string): string {
  let decoded = he.decode(text);
  return decoded.replace(/<[^>]+>/g, "");
}

export function decodeHtmlLink(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

export function extimateTime(
  words: number,
  wordsPerMinute: number = 120
): string {
  // Calculate total time in seconds
  const totalSeconds = Math.ceil((words / wordsPerMinute) * 60);

  // Convert to hours, minutes, and seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Build the formatted time string
  const formattedTime = [
    hours > 0 ? `${hours}h` : "", // Include hours if greater than 0
    minutes > 0 ? `${minutes}min` : "", // Include minutes if greater than 0
    `${seconds}s`, // Always include seconds
  ]
    .filter(Boolean)
    .join(" "); // Filter out empty parts and join with a space

  return formattedTime;
}

export function countWords(text: string): number {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  const words = text.trim().split(/\s+/);

  return words.length;
}

export function createExcerpt(text: string) {
  const index = text.indexOf(".");
  if (index === -1) {
    return removeHTMLTagsAndLimit(text, 140);
  }
  if (text.substring(0, index).length < 50) {
    const secondIndex = text.indexOf(".", index + 1);
    if (text.substring(0, index).length < 70) {
      const finalIndex = text.indexOf(".", secondIndex + 1);
      return removeHtmlTags(text.substring(0, finalIndex) + ".");
    }
    return removeHtmlTags(text.substring(0, secondIndex) + ".");
  }

  return removeHtmlTags(text.substring(0, index) + ".");
}

export function getStringAfterFirstDot(input: string): string {
  const index = input.indexOf(".");
  if (index === -1) {
    return "";
  }
  return input.substring(index + 1);
}

export function getStringBeforeSubstring(
  input: string,
  substring: string
): string {
  const index = input.indexOf(substring);
  if (index === -1) {
    return input;
  }
  return input.substring(0, index);
}

export const extractStringInsideParentheses = (input: string): string => {
  const match = input.match(/\(([^)]+)\)/);
  return match ? match[1] : "";
};

export function extractSectionCaracteristics(input: string): string {
  const startIndex = input.indexOf("Características");
  if (startIndex === -1) {
    return "";
  }

  const endIndex = input.indexOf("Especificações Técnicas", startIndex);
  if (endIndex === -1) {
    return input.substring(startIndex);
  }

  return input.substring(startIndex, endIndex).trim();
}

export function extractSectionSpecs(input: string): string {
  const startIndex = input.indexOf("Especificações Técnicas");
  if (startIndex === -1) {
    return "";
  }

  return input.substring(startIndex);
}

export function stringContainsSubstring(mainString: string, substring: string) {
  const escapedSubstring = substring.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const regex = new RegExp(".*" + escapedSubstring + ".*", "i");
  return regex.test(mainString);
}

export function removeHtmlTags(inputString: string): string {
  // Remove tags HTML
  const noTags = inputString.replace(/<[^>]*>/g, "");

  // Remove entidades HTML como &nbsp;, &hellip;, etc.
  const noEntities = noTags.replace(/&[a-zA-Z0-9#]+;/g, "");

  return noEntities.trim();
}

export function capitalizeFirstLetter(text: string): string {
  if (!text || text.length === 0) {
    return text;
  }
  const firstChar = text.charAt(0);
  if (firstChar === firstChar.toUpperCase()) {
    return text;
  }
  return firstChar.toUpperCase() + text.slice(1);
}
