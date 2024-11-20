/* eslint-disable react/no-is-mounted */

import axios, { AxiosInstance } from "axios";

import Cookies from "js-cookie";
import { Post } from "./types/posts.dto";

export abstract class BaseUnauthenticatedApi {
  protected _api: AxiosInstance;
  protected _lang: string;

  public constructor(endpoint: string, region?: string) {
    const cookieLang = Cookies.get("lang");
    this._lang = cookieLang ? cookieLang : "en";
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error("env variable NEXT_PUBLIC_API_BASE_URL not set");
    }
    this._api = axios.create({
      baseURL: `${process.env.WP_BASE_URL}/${endpoint}`,
    });

    this._api.defaults.headers.common["Accept"] = "*/*";
  }

  public findFeaturedMedia(post: Post, size?: string): string {
    let url;
    if (post._embedded) {
      if (post._embedded["wp:featuredmedia"]?.length > 0) {
        if (
          post._embedded["wp:featuredmedia"][0].media_details.sizes &&
          size != "full"
        ) {
          switch (size) {
            case "thumbnail":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes
                  .thumbnail?.source_url;
              break;
            case "medium":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes.medium
                  ?.source_url;
              break;
            case "large":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes.large
                  ?.source_url;
              break;
            case "full":
              url =
                post._embedded["wp:featuredmedia"][0].media_details.sizes.full
                  ?.source_url;
              break;
          }
        } else {
          url = post._embedded["wp:featuredmedia"][0].source_url;
        }
      }
    }
    if (url) return url;
    return "";
  }
}
