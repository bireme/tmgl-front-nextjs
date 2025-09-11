import {
  EvidenceMapItemDto,
  EvidenceMapsServiceDto,
} from "../types/evidenceMapsDto";
import {
  applyDefaultResourceFilters,
  mapJoinedMultLangArrayToFilterItem,
  parseCountries,
  parseMultLangFilter,
  parseMultLangStringAttr,
  parseTematicAreas,
} from "./utils";
import {
  getCountryTags,
  getDescriptorTags,
  getRegionByCountry,
} from "@/components/feed/utils";

import { DefaultResourceDto } from "../types/defaultResource";
import { RepositoryApiResponse } from "../types/repositoryTypes";
import { TagItem } from "@/components/feed/resourceitem";
import axios from "axios";
import moment from "moment";
import { queryType } from "../types/resources";

export class LisService {
  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>
  ): Promise<EvidenceMapsServiceDto> => {
    let query = undefined;
    let q = undefined;

    query = `thematic_area:"TMGL"source_type:"databases_bibliography"${
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

    let responseItems: EvidenceMapItemDto[] = [];
    if (data) {
      responseItems = data.data.diaServerResponse[0].response.docs.map(
        (item) => {
          return {
            id: item.id,
            title: item.title,
            excerpt: item.abstract,
            links: item.link,
            countries: parseCountries(item),
            created_at: moment(item?.created_date, "YYYYMMDD").toDate(),
            updated_at: moment(item?.updated_date, "YYYYMMDD").toDate(),
            areas: parseTematicAreas(item),
            descriptors: item.descriptor,
          };
        }
      );
    }

    let responseDto: EvidenceMapsServiceDto = {
      totalFound: data.data.diaServerResponse[0].response.numFound,
      data: responseItems,
      languageFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields.language
      ),
      countryFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields.publication_country.map(
          ([joinedLangStr]) => joinedLangStr.replace(/\^/g, "|")
        )
      ),
      thematicAreaFilters:
        data.data.diaServerResponse[0].facet_counts.facet_fields.descriptor_filter.map(
          (item) => {
            return {
              type: item[0],
              count: parseInt(item[1]),
            };
          }
        ),
    };
    return responseDto;
  };

  public getItem = async (id: string): Promise<EvidenceMapsServiceDto> => {
    let query = undefined;
    let q = undefined;

    query = `thematic_area:"TMGL-EV"id:"${id}"`;
    q = "AND";
    const { data } = await axios.post<RepositoryApiResponse>(
      `/api/evidencemaps`,
      {
        query,
        count: 1,
        start: 0,
        q,
      }
    );

    let responseItems: EvidenceMapItemDto[] = [];
    if (data) {
      responseItems = data.data.diaServerResponse[0].response.docs.map(
        (item) => {
          return {
            id: item.id,
            title: item.title,
            excerpt: item.abstract,
            links: item.link,
            countries: parseCountries(item),
            created_at: moment(item?.created_date, "YYYYMMDD").toDate(),
            updated_at: moment(item?.updated_date, "YYYYMMDD").toDate(),
            areas: parseTematicAreas(item),
            descriptors: item.descriptor,
          };
        }
      );
    }

    let responseDto: EvidenceMapsServiceDto = {
      totalFound: data.data.diaServerResponse[0].response.numFound,
      data: responseItems,
      languageFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields.language
      ),
      countryFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields.publication_country.map(
          ([joinedLangStr]) => joinedLangStr.replace(/\^/g, "|")
        )
      ),
      thematicAreaFilters:
        data.data.diaServerResponse[0].facet_counts.facet_fields.descriptor_filter.map(
          (item) => {
            return {
              type: item[0],
              count: parseInt(item[1]),
            };
          }
        ),
    };
    return responseDto;
  };

  public formatTags = (item: EvidenceMapItemDto, language: string) => {
    const countries = item.countries
      ? getCountryTags(item.countries, language)
      : [];

    let descriptors = item.descriptors
      ? getDescriptorTags(item.descriptors)
      : [];

    if (descriptors.length > 0) descriptors = descriptors.slice(0, 1);

    let engCountries = item.countries?.map((c) => {
      const item = c.countryLangs.find((cl) => cl.lang == "en");
      if (item && item.countryName) {
        return item.countryName;
      } else return "";
    });
    let regions: Array<TagItem> = [];
    if (engCountries) {
      regions = item.countries
        ? getRegionByCountry(engCountries).map((c) => ({
            name: c,
            type: "region",
          }))
        : [];
    }

    let tags = countries.concat(descriptors);
    if (regions.length > 0) {
      tags = tags.concat(regions);
    }
    return tags;
  };

  public getTableauVixLink = (links: string[]): string | null => {
    const link = links.find((l) => l.includes("tableau"));
    if (!link) {
      return null;
    }
    if (link.includes("app/profile/bireme")) {
      let newLink = link.replace("app/profile/bireme/viz", "views");
      newLink +=
        "?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link";
      return newLink;
    } else {
      if (link.includes("views") && !link.includes("viz_share_link")) {
        return link;
      }
    }
    return null;
  };

  public getDefaultResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    baseFilter?: string,
    souceType?: string
  ): Promise<DefaultResourceDto> => {
    const allResults = await Promise.all([
      this.getLisResources(10000, 0, lang, [], false, baseFilter, souceType),
    ]);

    const mergedData = allResults.flatMap((r) => r.data);

    let orderedData = mergedData.sort((a, b) => {
      const yearA = parseInt(a.year || "0");
      const yearB = parseInt(b.year || "0");
      return yearB - yearA;
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

  public getLisResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean,
    baseFilter?: string,
    source_type?: string
  ): Promise<DefaultResourceDto> => {
    let query = undefined;
    let q = undefined;

    query = `thematic_area:"${baseFilter ? baseFilter : "TMGL"}"${
      source_type ? `source_type:"${source_type}"` : ""
    }${and ? "&" : ""}${
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
            documentType: "Internet Resources",
            thematicArea: d.descriptor,
            region: d.publication_country
              ? getRegionByCountry([
                  parseMultLangStringAttr(
                    d.publication_country[0]
                      .split("|")
                      .map((i) => i.replace("^", "|"))
                  ).find((i) => i.lang == lang)?.content || "",
                ])[0]
              : "",
            year: moment(d.created_date, "YYYYMMDD").format("YYYY"),
          };
        }),
        countryFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields
            .publication_country,
          lang
        ),
        totalFound: data.data.diaServerResponse[0].response.numFound,
        documentTypeFilter: [
          {
            type: "Internet Resources",
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
            (t) => {
              return {
                type: t[0],
                count: parseInt(t[1]),
              };
            }
          ),
        yearFilter: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            type: moment(d.created_date, "YYYYMMDD").format("YYYY"),
            count: 1,
          };
        }),
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
