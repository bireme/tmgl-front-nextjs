import {
  MultimediaDiaServerResponse,
  MultimediaObject,
  MultimediaResponse,
  MultimediaResponseItems,
  MultimediaServiceDto,
} from "../types/multimediaTypes";

import axios from "axios";
import { parseMultLangFilter } from "./utils";
import { queryType } from "../types/resources";

export class MultimediaService {
  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    lang?: string
  ): Promise<MultimediaServiceDto> => {
    try {
      let query = undefined;
      let q = undefined;
      const countryQueryCount = queryItems?.filter(
        (q) => q.parameter == "country"
      ).length
        ? queryItems?.filter((q) => q.parameter == "country").length
        : 0;

      if (countryQueryCount <= 1)
        query = `thematic_area:"TMGL"${queryItems ? "&" : ""}${
          queryItems
            ? queryItems
                .map((k) => {
                  return `${k.parameter}:"${k.query}"`;
                })
                .join("&")
            : ""
        }`;
      else {
        query = `thematic_area:"TMGL&"${
          queryItems
            ? queryItems
                .filter((q) => q.parameter != "country")
                .map((k) => {
                  return `${k.parameter}:"${k.query}"`;
                })
                .join("&")
            : ""
        }`;
      }
      q = "*:*";

      let { data } = await axios.post<MultimediaResponse>(`/api/multimedia`, {
        query,
        count,
        start,
        q,
        lang,
      });
      let returnObj = data.data.diaServerResponse[0];

      for (let i = 0; i < returnObj.response.docs.length; i++) {
        const doc = returnObj.response.docs[i];

        if (doc.media_type == "video") {
          let thumbnail = await this.getVideoThumbnail(doc);
          doc.thumbnail = thumbnail;
        } else {
          doc.thumbnail = doc.link[0];
        }
      }

      returnObj.response.docs = returnObj.response.docs.reverse();

      return {
        data: returnObj.response.docs,
        totalFound: returnObj.response.numFound,
        languageFilters: returnObj.facet_counts.facet_fields.language.map(
          (k) => {
            return { type: k[0], count: parseInt(k[1]) };
          }
        ),
        regionFilters: returnObj.facet_counts.facet_fields.scope_region.map(
          (k) => {
            return { type: k[0], count: parseInt(k[1]) };
          }
        ),
        thematicAreaFilters:
          returnObj.facet_counts.facet_fields.descriptor_filter.map((k) => {
            return { type: k[0], count: parseInt(k[1]) };
          }),
        countryFilters: [],
        typeFilters: parseMultLangFilter(
          returnObj.facet_counts.facet_fields.media_type_filter
        ),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error while searching medias");
    }
  };

  public getItem = async (
    id: string,
    lang: string
  ): Promise<MultimediaResponse> => {
    const response = await axios.post<MultimediaResponse>(`/api/multimedia`, {
      id,
      lang,
    });
    return response.data;
  };

  public getVideoThumbnail = async (obj: MultimediaObject): Promise<string> => {
    let videoId: string;
    const url = obj.link[0];

    if (url.includes("vimeo")) {
      videoId = url.split("vimeo.com/")[1];
      const vimeoProps = await axios.get(
        `https://vimeo.com/api/v2/video/${videoId}.json`
      );
      return vimeoProps.data[0].thumbnail_large;
    }

    if (url.includes("youtube") || url.includes("youtu.be")) {
      try {
        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.search);
        videoId = params.get("v") ?? "";

        if (!videoId) {
          const pathSegments = parsedUrl.pathname.split("/");
          videoId = pathSegments[pathSegments.length - 1];
        }

        if (videoId.includes("?")) videoId = videoId.split("?")[0];

        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } catch (e) {
        console.warn("Erro ao parsear URL do YouTube:", url);
      }
    }

    return "/local/jpeg/multimedia.jpg";
  };
}
