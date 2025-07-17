import {
  BibliographicItemDto,
  BibliographicServerResponseDTO,
} from "../types/bibliographicDto";
import {
  mapJoinedMultLangArrayToFilterItem,
  mergeFilterItems,
  parseMultLangStringAttr,
} from "./utils";

import { GlobalSummitDto } from "../types/globalSummitDto";
import { LegislationServerResponseDTO } from "../types/legislationsTypes";
import { MultimediaResponse } from "../types/multimediaTypes";
import { RepositoryApiResponse } from "../types/repositoryTypes";
import axios from "axios";
import moment from "moment";
import { queryType } from "../types/resources";

export class GlobalSummitService {
  public getResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<GlobalSummitDto> => {
    const allResults = await Promise.all([
      this.getBibliographic(10000, 0, lang!, queryItems, and),
      this.getMultimedia(10000, 0, lang!, queryItems, and),
      this.getLegislations(10000, 0, lang!, queryItems, and),
      this.getLisResources(10000, 0, lang!, queryItems, and),
    ]);

    // Unifica os dados de todos os recursos
    const mergedData = allResults.flatMap((r) => r.data);

    // Ordena por ano decrescente (ou outro critério, se preferir)
    const orderedData = mergedData.sort((a, b) => {
      const yearA = parseInt(a.year || "0");
      const yearB = parseInt(b.year || "0");
      return yearB - yearA;
    });

    // Aplica a paginação solicitada
    const paginated = orderedData.slice(start, start + count);

    return {
      data: paginated,
      totalFound: allResults.reduce(
        (sum, res) => sum + (res.totalFound || 0),
        0
      ),
      countryFilter: mergeFilterItems(
        allResults[0].countryFilter,
        allResults[1].countryFilter
      ),
      documentTypeFilter: [],
      eventFilter: [],
      regionFilter: [],
      thematicAreaFilter: [],
      yearFilter: [],
    };
  };

  public getBibliographic = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<GlobalSummitDto> => {
    let query = undefined;
    let q = undefined;
    query = `database:"GTM Summit - The First WHO Tradicional Medicine Global Summit"${
      and ? "&" : ""
    }${
      queryItems
        ? queryItems
            .map((k) => {
              return `${k.parameter}:"${k.query.replace('"', "")}"`;
            })
            .join("&")
        : ""
    }`;
    q = "*:*";
    const { data } = await axios.post<BibliographicServerResponseDTO>(
      `/api/bibliographic`,
      {
        query,
        count,
        start,
        q,
      }
    );
    if (data) {
      return {
        data: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            excerpt: d.reference_abstract ? d.reference_abstract[0] : "",
            title: d.reference_title[0],
            id: d.id,
            link: d.link ? d.link[0] : "",
            country: d.publication_country
              ? parseMultLangStringAttr(
                  d.publication_country[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            documentType: d.publication_type[0],
            year: d.publication_year,
            thematicArea: "",
          };
        }),
        countryFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields
            .publication_country,
          lang
        ),
        documentTypeFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_type.map(
            (t) => {
              return {
                type: t[0],
                count: t[1],
              };
            }
          ),
        eventFilter: [],
        regionFilter: [],
        thematicAreaFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.descriptor_filter.map(
            (t) => {
              return {
                type: t[0],
                count: t[1],
              };
            }
          ),
        yearFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_year.map(
            (t) => {
              return {
                type: t[0],
                count: t[1],
              };
            }
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

  public getMultimedia = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<GlobalSummitDto> => {
    let query = undefined;
    let q = undefined;
    const countryQueryCount = queryItems?.filter(
      (q) => q.parameter == "country"
    ).length
      ? queryItems?.filter((q) => q.parameter == "country").length
      : 0;

    if (countryQueryCount <= 1)
      query = `thematic_area:"GTMSummit"${queryItems ? "&" : ""}${
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
    if (data) {
      return {
        data: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            excerpt: d.description[0],
            id: d.id.toString(),
            link: d.link[0],
            documentType: d.media_type_display
              ? parseMultLangStringAttr(
                  d.media_type_display[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            title: d.title,
            country: d.publication_country
              ? parseMultLangStringAttr(
                  d.publication_country[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            thematicArea: d.thematic_area_display
              ? parseMultLangStringAttr(
                  d.thematic_area_display[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            year: d.publication_year,
          };
        }),
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
        regionFilter: [],
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

  public getLegislations = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<GlobalSummitDto> => {
    let query = undefined;
    let q = undefined;
    query = `indexed_database:"TMGL-Africa"${and ? "&" : ""}${
      queryItems
        ? queryItems
            .map((k) => {
              return `${k.parameter}:"${k.query.replace('"', "")}"`;
            })
            .join("&")
        : ""
    }`;
    q = "*:*";
    const { data } = await axios.post<LegislationServerResponseDTO>(
      `/api/legislations`,
      {
        query,
        count,
        start,
        q,
      }
    );
    if (data) {
      return {
        data: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            excerpt: d.official_ementa[0],
            id: d.id,
            link: d.fulltext[0].split("|")[1],
            title: d.title,
            country: parseMultLangStringAttr(
              d.scope_region[0].split("|").map((i) => i.replace("^", "|"))
            ).find((i) => i.lang == lang)?.content,
            documentType: parseMultLangStringAttr(
              d.act_type[0].split("|").map((i) => i.replace("^", "|"))
            ).find((i) => i.lang == lang)?.content,
            thematicArea: parseMultLangStringAttr(
              d.thematic_area_display[0]
                .split("|")
                .map((i) => i.replace("^", "|"))
            ).find((i) => i.lang == lang)?.content,
            year: d.publication_year,
          };
        }),
        countryFilter: [],
        documentTypeFilter: [],
        eventFilter: [],
        regionFilter: [],
        thematicAreaFilter: [],
        yearFilter: [],
        totalFound: data.data.diaServerResponse[0].response.numFound,
      };
    }
    return {
      data: [],
      countryFilter: [],
      documentTypeFilter: [],
      eventFilter: [],
      regionFilter: [],
      totalFound: 0,
      thematicAreaFilter: [],
      yearFilter: [],
    };
  };

  //Ainda tem que terminar   thematic_area:"GTMSummit"
  public getLisResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<GlobalSummitDto> => {
    let query = undefined;
    let q = undefined;

    query = `thematic_area:"GTMSummit"${and ? "&" : ""}${
      queryItems
        ? queryItems
            .map((k) => {
              return `${k.parameter}:"${k.query.replace('"', "")}"`;
            })
            .join("&")
        : ""
    }`;
    q = "*:*";
    const { data } = await axios.post<RepositoryApiResponse>(
      `/api/evidencemaps`,
      {
        query,
        count,
        start,
        q,
      }
    );
    if (data) {
      return {
        data: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            excerpt: d.abstract,
            id: d.id,
            link: d.link[0],
            title: d.title,
            country: d.publication_country
              ? parseMultLangStringAttr(
                  d.publication_country[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            documentType: "Legislation",
            thematicArea: d.publication_country
              ? parseMultLangStringAttr(
                  d.thematic_area_display[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            year: moment(d.created_date, "YYYYMMDD").format("YYYY"),
          };
        }),
        countryFilter: [],
        totalFound: data.data.diaServerResponse[0].response.numFound,
        documentTypeFilter: [],
        eventFilter: [],
        regionFilter: [],
        thematicAreaFilter: [],
        yearFilter: [],
      };
    }
    return {
      data: [],
      countryFilter: [],
      documentTypeFilter: [],
      eventFilter: [],
      totalFound: 0,
      regionFilter: [],
      thematicAreaFilter: [],
      yearFilter: [],
    };
  };
}
