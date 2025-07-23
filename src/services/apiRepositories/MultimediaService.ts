import {
  MultimediaObject,
  MultimediaResponse,
  MultimediaServiceDto,
} from "../types/multimediaTypes";
import {
  applyDefaultResourceFilters,
  mapJoinedMultLangArrayToFilterItem,
  parseMultLangFilter,
  parseMultLangStringAttr,
} from "./utils";

import { DefaultResourceDto } from "../types/defaultResource";
import axios from "axios";
import { getRegionByCountry } from "@/components/feed/utils";
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
            return { type: k[0], count: k[1] };
          }
        ),
        thematicAreaFilters:
          returnObj.facet_counts.facet_fields.descriptor_filter.map((k) => {
            return { type: k[0], count: parseInt(k[1]) };
          }),
        countryFilters: [],
        typeFilters: parseMultLangFilter(
          data.data.diaServerResponse[0].facet_counts.facet_fields.media_type_filter.map(
            ([joinedLangStr]) => joinedLangStr.replace(/\^/g, "|")
          )
        ),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Error while searching medias");
    }
  };

  public getMultimediaResource = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean,
    baseFilter?: string
  ): Promise<DefaultResourceDto> => {
    let query = undefined;
    let q = undefined;

    query = `thematic_area:"${baseFilter ? baseFilter : "TMGL"}"${
      queryItems ? "&" : ""
    }${
      queryItems
        ? queryItems
            .map((k) => {
              return `${k.parameter}:"${k.query}"`;
            })
            .join("&")
        : ""
    }`;

    q = "*:*";

    let { data } = await axios.post<MultimediaResponse>(`/api/multimedia`, {
      query,
      count,
      start,
      q,
      lang,
    });
    if (data) {
      const docs = [];
      const docsRaw = data.data.diaServerResponse[0].response.docs;

      for (const d of docsRaw) {
        if (d.media_type === "video") {
          try {
            const thumbnail = await this.getVideoThumbnail(d);
            d.thumbnail = thumbnail;
          } catch (err) {
            console.warn("Erro ao gerar thumbnail de vídeo:", err);
            d.thumbnail = "";
          }
        } else {
          d.thumbnail = d.link[0];

          if (d.media_type === "Imagem fixa" || d.media_type === "Slide") {
            try {
              const { data } = await axios.post(`/api/pdf-image`, {
                url: d.thumbnail,
              });
              console.log("buscando imagem");
              d.thumbnail = data.file;
            } catch (err) {
              console.warn("Erro ao gerar thumbnail de PDF:", err);
              d.thumbnail = "";
            }
          }
        }

        docs.push({
          excerpt: d.description ? d.description[0] : "",
          id: d.id.toString(),
          link: d.link[0],
          documentType: d.media_type
            ? parseMultLangStringAttr(
                d.media_type[0].split("|").map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content
            : "",
          title: d.title_translated
            ? d.title_translated[0]
            : d.title
            ? d.title
            : "",
          thumbnail: d.thumbnail,
          modality: d.media_type
            ? parseMultLangStringAttr(
                d.media_type[0].split("|").map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content
            : "",
          country: d.publication_country
            ? parseMultLangStringAttr(
                d.publication_country[0]
                  .split("|")
                  .map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content
            : "",
          thematicArea: d.descriptor,
          year: d.publication_year,
          region: d.publication_country
            ? getRegionByCountry([
                parseMultLangStringAttr(
                  d.publication_country[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content || "",
              ])[0]
            : "",
        });
      }
      return {
        data: docs,
        countryFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields
            .publication_country,
          lang
        ),
        documentTypeFilter: [
          {
            type: "Multimedia",
            count: data.data.diaServerResponse[0].response.numFound,
          },
        ],
        eventFilter: [],
        regionFilter: getRegionByCountry(
          mapJoinedMultLangArrayToFilterItem(
            data.data.diaServerResponse[0].facet_counts.facet_fields
              .publication_country,
            lang
          ).map((c) => c.type)
        ).map((r) => {
          return { type: r, count: 99 };
        }),
        thematicAreaFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.descriptor_filter.map(
            (y) => {
              return { type: y[0], count: parseInt(y[1]) };
            }
          ),
        yearFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_year.map(
            (y) => {
              return { type: y[0], count: parseInt(y[1]) };
            }
          ),
        resourceTypeFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields
            .media_type_filter,
          lang
        ),
        totalFound: data.data.diaServerResponse[0].response.numFound,
      };
    }
    return {
      data: [],
      countryFilter: [],
      documentTypeFilter: [],
      eventFilter: [],
      regionFilter: [],
      thematicAreaFilter: [],
      yearFilter: [],
      totalFound: 0,
    };
  };

  public getDefaultResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>
  ): Promise<DefaultResourceDto> => {
    const allResults = await Promise.all([
      this.getMultimediaResource(10000, 0, lang),
    ]);

    const mergedData = allResults.flatMap((r) => r.data);

    let orderedData = mergedData.sort((a, b) => {
      const yearA = parseInt(a.year || "0");
      const yearB = parseInt(b.year || "0");
      return yearB - yearA;
    });

    if (queryItems) {
      orderedData = applyDefaultResourceFilters(queryItems, orderedData);
    }
    const paginated = orderedData.slice(start, start + count);

    return {
      data: paginated,
      totalFound: orderedData.length,
      countryFilter: allResults[0].countryFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      documentTypeFilter: allResults[0].documentTypeFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      eventFilter: allResults[0].eventFilter?.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      regionFilter: allResults[0].regionFilter,
      thematicAreaFilter: allResults[0].thematicAreaFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      yearFilter: allResults[0].yearFilter.sort(
        (a, b) => Number(a.type) + Number(b.type)
      ),
      resourceTypeFilter: allResults[0].resourceTypeFilter?.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
    };
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
