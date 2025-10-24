import { FilterItem, queryType } from "../types/resources";
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
import SparkMD5 from "spark-md5";
import axios from "axios";
import { getRegionByCountry } from "@/components/feed/utils";

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
      throw new Error("Error while searching medias");
    }
  };

  public getMultimediaResource = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean,
    baseFilter?: string,
    thumbnail?: boolean
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

      // Process thumbnails in parallel for better performance
      if (thumbnail) {
        // Separate videos and images for different processing
        const videoItems = docsRaw.filter(d => d.media_type === "video");
        const imageItems = docsRaw.filter(d => 
          d.media_type === "Imagem fixa" || d.media_type === "Slide"
        );

        // Process videos in parallel with better error handling
        const videoPromises = videoItems.map(async (d) => {
          try {
            const thumbnail = await this.getVideoThumbnail(d);
            d.thumbnail = thumbnail || "/local/jpeg/multimedia.jpg";
          } catch (err) {
            console.warn("Erro ao gerar thumbnail de vídeo:", err);
            d.thumbnail = "/local/jpeg/multimedia.jpg"; // Fallback image
          }
          return d;
        });

        // Check existing thumbnails for images in batch
        let thumbnailCheckResults: Record<string, any> = {};
        if (imageItems.length > 0) {
          try {
            const urls = imageItems.map(d => d.link[0]);
            const { data } = await axios.post('/api/check-thumbnails', { urls });
            thumbnailCheckResults = data.results.reduce((acc: any, result: any) => {
              acc[result.url] = result;
              return acc;
            }, {});
          } catch (err) {
            console.warn("Erro ao verificar thumbnails em lote:", err);
          }
        }

        // Process images with batch check results
        const imagePromises = imageItems.map(async (d) => {
          d.thumbnail = d.link[0];
          const checkResult = thumbnailCheckResults[d.thumbnail];
          
          if (checkResult && checkResult.exists) {
            d.thumbnail = checkResult.thumbnail;
          } else {
            try {
              const { data } = await axios.post(`/api/pdf-image`, {
                url: d.thumbnail,
              });
              d.thumbnail = data.file;
            } catch (err) {
              console.warn("Erro ao gerar thumbnail:", err);
              d.thumbnail = "";
            }
          }
          return d;
        });

        // Wait for all thumbnails to be processed in parallel
        await Promise.all([...videoPromises, ...imagePromises]);
      }

      for (const d of docsRaw) {

        docs.push({
          excerpt: d.description ? d.description[0] : "",
          id: d.id.toString(),
          link: d.link[0],
          resourceType: d.media_type_display
            ? parseMultLangStringAttr(
                d.media_type_display[0]
                  .split("|")
                  .map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content
            : "",
          documentType: d.media_type_display
            ? parseMultLangStringAttr(
                d.media_type_display[0]
                  .split("|")
                  .map((i) => i.replace("^", "|"))
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
        countryFilter: data.data.diaServerResponse[0].response.docs
          .map((d) => {
            if (d.publication_country) {
              const item = parseMultLangStringAttr(
                d.publication_country[0]
                  .split("|")
                  .map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content;
              return {
                type: item ? item : "",
                count: 1,
              };
            }
            return { type: "", count: 0 };
          }) // remove vazios
          .filter((i) => i.type !== "" && i.count > 0)
          // agrupa por type
          .reduce((acc: FilterItem[], cur: FilterItem) => {
            const found = acc.find((x: any) => x.type === cur.type);
            if (found) {
              found.count += cur.count;
            } else {
              acc.push({ ...cur });
            }
            return acc;
          }, []),
        documentTypeFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.media_type_filter.map(
            (y) => {
              return {
                type:
                  parseMultLangStringAttr(
                    y[0].split("|").map((i) => i.replace("^", "|"))
                  ).find((i) => i.lang == lang)?.content || "",
                count: y[1],
              };
            }
          ),
        eventFilter: [],
        regionFilter: getRegionByCountry(
          data.data.diaServerResponse[0].response.docs.map((d) => {
            if (d.publication_country) {
              const item = parseMultLangStringAttr(
                d.publication_country[0]
                  .split("|")
                  .map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content;
              return item ? item : "";
            }
            return "";
          })
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
    queryItems?: Array<queryType>,
    thumbnail?: boolean
  ): Promise<DefaultResourceDto> => {
    const allResults = await Promise.all([
      this.getMultimediaResource(
        750,
        0,
        lang,
        [],
        false,
        undefined,
        thumbnail ? true : false
      ),
    ]);

    const mergedData = allResults.flatMap((r) => r.data);

    const orderedData = mergedData.slice().sort((a, b) => {
      const yA = Number.parseInt(a.year ?? "0", 10) || 0;
      const yB = Number.parseInt(b.year ?? "0", 10) || 0;
      if (yA !== yB) return yB - yA;

      const aKey = (a.id ?? a.title ?? a.excerpt ?? "")
        .toString()
        .toLowerCase();
      const bKey = (b.id ?? b.title ?? b.excerpt ?? "")
        .toString()
        .toLowerCase();
      return aKey.localeCompare(bKey);
    });

    // aplica filtro só se houver itens
    const hasQuery = Array.isArray(queryItems) && queryItems.length > 0;

    // não deixe o TS inferir union esquisito → anote como unknown
    const filteredResult: unknown = hasQuery
      ? applyDefaultResourceFilters(queryItems!, orderedData)
      : orderedData;

    // normalize para SEMPRE virar array (sem mudar DTOs/funções existentes)
    const filteredArray = Array.isArray(filteredResult)
      ? filteredResult
      : filteredResult &&
        typeof filteredResult === "object" &&
        "data" in (filteredResult as any) &&
        Array.isArray((filteredResult as any).data)
      ? (filteredResult as any).data
      : orderedData;

    // paginação
    const pageSize = Math.max(0, count);
    const window = filteredArray.slice(start, start + pageSize + 1);
    const hasNext = window.length > pageSize;
    const paginated = hasNext ? window.slice(0, pageSize) : window;

    return {
      data: paginated,
      totalFound: filteredArray.length,
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
    const url = obj.link[0];

    try {
      // Use our proxy API to avoid CORS issues and handle API changes
      const { data } = await axios.post('/api/video-thumbnail', { url }, {
        timeout: 3000 // 3 second timeout to avoid hanging
      });
      return data.thumbnail || "/local/jpeg/multimedia.jpg";
    } catch (error) {
      console.warn("Erro ao obter thumbnail de vídeo:", error);
      return "/local/jpeg/multimedia.jpg";
    }
  };

  public getCachedThumbnailPath(url: string): string {
    const hash = SparkMD5.hash(url);
    return `/pdfs/${hash}.png`;
  }
}
