import {
  BibliographicItemDto,
  BibliographicServerResponseDTO,
} from "../types/bibliographicDto";
import axios, { all } from "axios";
import {
  mapBibliographicTypes,
  mapJoinedMultLangArrayToFilterItem,
  mergeFilterItems,
  parseMultLangStringAttr,
} from "./utils";

import { GlobalSummitDto } from "../types/globalSummitDto";
import { LegislationServerResponseDTO } from "../types/legislationsTypes";
import { MultimediaResponse } from "../types/multimediaTypes";
import { RepositoryApiResponse } from "../types/repositoryTypes";
import { getRegionByCountry } from "@/components/feed/utils";
import moment from "moment";
import { queryType } from "../types/resources";

export class RegulationsAndPolicesService {
  public getResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<GlobalSummitDto> => {
    const allResults = await Promise.all([
      this.getBibliographic(10000, 0, lang!),
      this.getLegislations(10000, 0, lang!),
    ]);

    // Unifica os dados de todos os recursos
    const mergedData = allResults.flatMap((r) => r.data);

    // Ordena por ano decrescente (ou outro critério, se preferir)
    let orderedData = mergedData.sort((a, b) => {
      const yearA = parseInt(a.year || "0");
      const yearB = parseInt(b.year || "0");
      return yearB - yearA;
    });

    if (queryItems) {
      const stringParameter = queryItems.filter((q) => q.parameter === "title");
      const yearFilters = queryItems
        .filter((q) => q.parameter === "year")
        .map((q) => q.query);
      const documentFilters = queryItems
        .filter((q) => q.parameter === "document_type")
        .map((q) => q.query);
      const thematicAreaFilters = queryItems
        .filter((q) => q.parameter === "thematic_area")
        .map((q) => q.query);
      const countryFilters = queryItems
        .filter((q) => q.parameter === "country")
        .map((q) => q.query);
      const regionFilters = queryItems
        .filter((q) => q.parameter === "region")
        .map((q) => q.query);

      if (regionFilters.length) {
        orderedData = orderedData.filter((item) =>
          regionFilters.includes(item.region ? item.region : "")
        );
      }

      if (stringParameter.length > 0) {
        orderedData = orderedData.filter(
          (item) =>
            item.title
              .toLowerCase()
              .includes(stringParameter[0].query.toLowerCase()) ||
            item.excerpt
              .toLowerCase()
              .includes(stringParameter[0].query.toLowerCase())
        );
      }

      if (yearFilters.length) {
        orderedData = orderedData.filter((item) =>
          yearFilters.includes(item.year ? item.year : "")
        );
      }
      if (countryFilters.length) {
        orderedData = orderedData.filter((item) =>
          countryFilters.includes(item.country ? item.country : "")
        );
      }
      if (documentFilters.length) {
        orderedData = orderedData.filter((item) =>
          documentFilters.includes(item.documentType ? item.documentType : "")
        );
      }
      if (thematicAreaFilters.length) {
        orderedData = orderedData.filter((item) =>
          Array.isArray(item.thematicArea)
            ? item.thematicArea.some((ta) => thematicAreaFilters.includes(ta))
            : thematicAreaFilters.includes(item.thematicArea || "")
        );
      }
    }

    // Aplica a paginação solicitada
    const paginated = orderedData.slice(start, start + count);

    return {
      data: paginated,
      totalFound: orderedData.length,
      countryFilter: mergeFilterItems(
        allResults[0].countryFilter,
        allResults[1].countryFilter
      ).sort((a, b) => a.type.localeCompare(b.type)),
      documentTypeFilter: mergeFilterItems(
        allResults[0].documentTypeFilter,
        allResults[1].documentTypeFilter
      ).sort((a, b) => a.type.localeCompare(b.type)),
      eventFilter: [],
      regionFilter: mergeFilterItems(allResults[0].regionFilter),
      thematicAreaFilter: mergeFilterItems(
        allResults[0].thematicAreaFilter,
        allResults[1].thematicAreaFilter
      ).sort((a, b) => a.type.localeCompare(b.type)),
      yearFilter: mergeFilterItems(
        allResults[0].yearFilter,
        allResults[1].yearFilter
      ).sort((a, b) => Number(a.type) + Number(b.type)),
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
    query = `database:"Legislations"${and ? "&" : ""}${
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
            documentType: mapBibliographicTypes(d.publication_type[0]),
            year: d.publication_year,
            thematicArea: d.mh,
            region: d.publication_country
              ? getRegionByCountry([
                  parseMultLangStringAttr(
                    d.publication_country[0]
                      .split("|")
                      .map((i) => i.replace("^", "|"))
                  ).find((i) => i.lang == lang)?.content || "",
                ])[0]
              : "",
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
                type: mapBibliographicTypes(t[0]),
                count: t[1],
              };
            }
          ),
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

  public getLegislations = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<GlobalSummitDto> => {
    let query = undefined;
    let q = undefined;
    query = `thematic_area:"TMGL"${and ? "&" : ""}${
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
            excerpt: d.official_ementa ? d.official_ementa[0] : "",
            id: d.id,
            link: d.fulltext[0].split("|")[1],
            title: d.title,
            country: parseMultLangStringAttr(
              d.scope_region[0].split("|").map((i) => i.replace("^", "|"))
            ).find((i) => i.lang == lang)?.content,
            documentType: "Legislation",
            thematicArea: d.descriptor,
            region: getRegionByCountry([
              parseMultLangStringAttr(
                d.scope_region[0].split("|").map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content || "",
            ])[0],
            year: d.publication_year,
          };
        }),
        countryFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields.scope_region,
          lang
        ),
        documentTypeFilter: [
          {
            type: "Legislation",
            count: data.data.diaServerResponse[0].response.numFound,
          },
        ],
        eventFilter: [],
        regionFilter: getRegionByCountry(
          mapJoinedMultLangArrayToFilterItem(
            data.data.diaServerResponse[0].facet_counts.facet_fields
              .scope_region,
            lang
          ).map((c) => c.type)
        ).map((r) => {
          return { type: r, count: 99 };
        }),
        thematicAreaFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.thematic_area_display.map(
            (i) => {
              let type = i[0]
                .split("|")
                .map((i) => i.replace("^", "|"))
                .find((i) => i[0] == lang);
              return {
                type: type ? type : "",
                count: parseInt(i[1]),
              };
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
      totalFound: 0,
      thematicAreaFilter: [],
      yearFilter: [],
    };
  };
}
