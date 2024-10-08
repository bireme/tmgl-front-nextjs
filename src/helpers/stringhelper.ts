import * as he from "he";

export function removeHTMLTagsAndLimit(text: string, limit: number): string {
  const strippedText = text.replace(/(<([^>]+)>)/gi, "");

  const truncatedText =
    strippedText.length > limit
      ? strippedText.substring(0, limit)
      : strippedText;
  return truncatedText;
}
export function decodeHtmlEntities(text: string): string {
  return he.decode(text);
}

export function extimateTime(words: number): number {
  return words * 10;
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
  const regex = /<[^>]*>/g;
  return inputString.replace(regex, "");
}
