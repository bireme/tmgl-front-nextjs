/* eslint-disable react/no-is-mounted */

import axios, { AxiosInstance } from "axios";

import Cookies from "js-cookie";
import { Post } from "./types/posts.dto";

export abstract class BaseUnauthenticatedApi {
  protected _api: AxiosInstance;
  protected _lang: string;
  protected _region?: string;

  public constructor(endpoint: string, region?: string) {
    const cookieLang = Cookies.get("lang");
    this._lang = cookieLang ? cookieLang : "en";
    if (region) this._region = region;
    if (!process.env.WP_BASE_URL) {
      throw new Error("env variable NEXT_PUBLIC_API_BASE_URL not set");
    }
    this._api = axios.create({
      baseURL: `${process.env.WP_BASE_URL}/${endpoint}`,
    });

    this._api.defaults.headers.common["Accept"] = "*/*";
  }

  public findFeaturedMedia(post: Post, size?: string): string {
    const fm = post?._embedded?.["wp:featuredmedia"]?.[0];
    if (!fm) return "";

    const sizes = fm.media_details?.sizes;
    let url: string | undefined;

    if (sizes) {
      // Ordem de prioridade para fallback
      const order = ["thumbnail", "medium", "large", "full"] as const;

      if (size && size !== "full") {
        url = sizes[size as keyof typeof sizes]?.source_url || undefined;
      } else if (size === "full") {
        url = sizes.full?.source_url || undefined;
      }
      if (!url) {
        for (const key of order) {
          const candidate = sizes[key]?.source_url;
          if (candidate) {
            url = candidate;
            break;
          }
        }
      }
    }
    if (!url) {
      url = fm.source_url;
    }
    return url ? url + (url.includes(".webp") ? "" : ".webp") : "";
  }
}
