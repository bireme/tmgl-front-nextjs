import { EventsItemsDto, EventsServiceDto } from "../types/eventsDto";
import {
  applyDefaultResourceFilters,
  mapJoinedMultLangArrayToFilterItem,
  mapToFilterItems,
  mergeFilterItems,
  parseCountriesByAttr,
  parseMultLangFilter,
  parseMultLangStringAttr,
} from "./utils";
import { getDescriptorTags, getRegionByCountry } from "@/components/feed/utils";
import moment, { lang } from "moment";

import { DefaultResourceDto, DefaultResourceItemDto } from "../types/defaultResource";
import { RepositoryApiResponse } from "../types/repositoryTypes";
import { TagItem } from "@/components/feed/resourceitem";
import axios from "axios";
import { queryType } from "../types/resources";
import { PostsApi } from "../posts/PostsApi";
import { Post } from "../types/posts.dto";

export class DireveService {
  /**
   * Gera filtros a partir dos dados mesclados
   */
  private generateFiltersFromMergedData(mergedData: DefaultResourceItemDto[]) {
    // Extrair valores únicos para cada filtro, garantindo que são strings
    const countries = [...new Set(mergedData.map(item => item.country).filter(Boolean))] as string[];
    const regions = [...new Set(mergedData.map(item => item.region).filter(Boolean))] as string[];
    const documentTypes = [...new Set(mergedData.map(item => item.documentType).filter(Boolean))] as string[];
    const resourceTypes = [...new Set(mergedData.map(item => item.resourceType).filter(Boolean))] as string[];
    const years = [...new Set(mergedData.map(item => item.year).filter(Boolean))] as string[];
    const modalities = [...new Set(mergedData.map(item => item.modality).filter(Boolean))] as string[];
    
    // Extrair thematic areas (pode ser array)
    const allThematicAreas = mergedData.flatMap(item => 
      Array.isArray(item.thematicArea) ? item.thematicArea : [item.thematicArea]
    ).filter(Boolean) as string[];
    const uniqueThematicAreas = [...new Set(allThematicAreas)];

    return {
      countryFilter: countries.map(country => ({ type: country, count: 0 })),
      regionFilter: regions.map(region => ({ type: region, count: 0 })),
      documentTypeFilter: documentTypes.map(docType => ({ type: docType, count: 0 })),
      resourceTypeFilter: resourceTypes.map(resType => ({ type: resType, count: 0 })),
      yearFilter: years.map(year => ({ type: year, count: 0 })),
      thematicAreaFilter: uniqueThematicAreas.map(area => ({ type: area, count: 0 })),
      eventFilter: modalities.map(modality => ({ type: modality, count: 0 })),
    };
  }

  /**
   * Converte posts do WordPress para o formato DefaultResourceItemDto
   */
  private convertWpPostsToDefaultResource(wpPosts: Post[]): DefaultResourceItemDto[] {
    return wpPosts.map((post: Post) => {
      // Extrair países e regiões dos termos embedded
      const countries = post._embedded?.["wp:term"]?.flat()?.filter(term => term.taxonomy === "country") || [];
      const regions = post._embedded?.["wp:term"]?.flat()?.filter(term => term.taxonomy === "region") || [];
      const tags = post._embedded?.["wp:term"]?.flat()?.filter(term => term.taxonomy === "post_tag") || [];

      // Extrair thumbnail da featured media
      const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
      const thumbnail = featuredMedia?.media_details?.sizes?.medium?.source_url || 
                       featuredMedia?.media_details?.sizes?.thumbnail?.source_url ||
                       featuredMedia?.source_url || "";

      // Extrair ano da data
      const year = post.date ? moment(post.date).format("YYYY") : "";

      const baseUrl = process.env.BASE_URL;
      return {
        id: post.id.toString(),
        link: `${baseUrl}/events/${post.slug}`,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered,
        country: countries.length > 0 ? countries[0].name : undefined,
        region: regions.length > 0 ? regions[0].name : undefined,
        thumbnail: thumbnail,
        thematicArea: tags.length > 0 ? tags.map(t => t.name) : undefined,
        documentType: "Event", // Posts do WordPress são eventos
        resourceType: "Event",
        year: year,
        modality: undefined, // Não disponível em posts do WordPress
      };
    });
  }

  public getDefaultResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>
  ): Promise<DefaultResourceDto> => {
    const allResults = await Promise.all([
      this.getDireveResources(10000, 0, lang!),
    ]);
    const _api = new PostsApi();
    const allWpEvents = await _api.getCustomPost("event", 100, 0);

    // Converter posts do WordPress para o formato DefaultResourceItemDto
    const convertedWpEvents = this.convertWpPostsToDefaultResource(allWpEvents);

    // Juntar dados do Direve com posts convertidos do WordPress
    const mergedData = [
      ...allResults.flatMap((r) => r.data),
      ...convertedWpEvents
    ];

    let orderedData = mergedData.sort((a, b) => {
      const yearA = parseInt(a.year || "0");
      const yearB = parseInt(b.year || "0");
      return yearB - yearA;
    });

    // Aplica filtros apenas uma vez, se existirem
    const filteredArray = queryItems && queryItems.length > 0
      ? applyDefaultResourceFilters(queryItems, orderedData)
      : orderedData;

    // Gerar filtros a partir dos dados mesclados
    const mergedFilters = this.generateFiltersFromMergedData(mergedData);

    // paginação
    const pageSize = Math.max(0, count);
    const window = filteredArray.slice(start, start + pageSize + 1);
    const hasNext = window.length > pageSize;
    const paginated = hasNext ? window.slice(0, pageSize) : window;

    return {
      data: paginated,
      totalFound: filteredArray.length,
      countryFilter: mergedFilters.countryFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      documentTypeFilter: mergedFilters.documentTypeFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      eventFilter: mergedFilters.eventFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      regionFilter: mergedFilters.regionFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      thematicAreaFilter: mergedFilters.thematicAreaFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
      yearFilter: mergedFilters.yearFilter.sort(
        (a, b) => Number(b.type) - Number(a.type)
      ),
      resourceTypeFilter: mergedFilters.resourceTypeFilter.sort((a, b) =>
        a.type.localeCompare(b.type)
      ),
    };
  };

  public getDireveResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<DefaultResourceDto> => {
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
    const { data } = await axios.post<RepositoryApiResponse>("/api/direve", {
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
            excerpt: d.observations ? d.observations?.join(",") : "",
            id: d.id,
            link: d.link[0],
            title: d.title,
            modality: d.event_modality ? d.event_modality[0] : "",
            country: d.country
              ? parseMultLangStringAttr(
                  d.country.split("|").map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            documentType: "Event",
            thematicArea: d.thematic_area_display
              ? d.thematic_area_display.map((t) => {
                  return (
                    parseMultLangStringAttr(
                      t.split("|").map((i) => i.replace("^", "|"))
                    ).find((i) => i.lang == lang)?.content || ""
                  );
                })
              : [],
            region: d.country
              ? getRegionByCountry([
                  parseMultLangStringAttr(
                    d.country.split("|").map((i) => i.replace("^", "|"))
                  ).find((i) => i.lang == lang)?.content || "",
                ])[0]
              : "",
            year: moment(d.created_date, "YYYYMMDD").format("YYYY"),
          };
        }),
        countryFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields.country,
          lang
        ),
        totalFound: data.data.diaServerResponse[0].response.numFound,
        documentTypeFilter: [
          {
            type: "Events",
            count: data.data.diaServerResponse[0].response.numFound,
          },
        ],
        eventFilter: [],
        regionFilter: getRegionByCountry(
          mapJoinedMultLangArrayToFilterItem(
            data.data.diaServerResponse[0].facet_counts.facet_fields.country,
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
        resourceTypeFilter: data.data.diaServerResponse[0].response.docs.map(
          (d) => {
            return {
              type: d.event_modality ? d.event_modality[0] : "",
              count: 1,
            };
          }
        ),
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

  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    language?: string,
    and?: boolean
  ): Promise<EventsServiceDto> => {
    try {
      let query = undefined;
      let q = undefined;

      //Adicionar o filtro de thematic area aqui
      query = `thematic_area:"TMGL"${
        queryItems
          ? queryItems.map((k) => {
              return `${k.parameter}:"${k.query.replace('"', "")}"`;
            })
          : ""
      }`;
      q = "*:*";

      const { data } = await axios.post<RepositoryApiResponse>("/api/direve", {
        query,
        count,
        start,
        q,
        lang: language,
      });

      let responseItems: EventsItemsDto[] = [];

      if (data) {
        responseItems = data.data.diaServerResponse[0].response.docs.map(
          (event: any) => {
            return {
              id: event.id,
              title: event.title,
              observations: event.observations?.join(" , "),
              location: event.location,
              date: event.date,
              countries: event.country
                ? parseCountriesByAttr([event.country])
                : [],
              target_groups: event.target_groups,
              descriptors: event.descriptor,
              modality: event.event_modality,
              links: [
                {
                  label: "Event Link",
                  url: event.link,
                },
              ],
            };
          }
        );
      }

      let responseDto: EventsServiceDto = {
        totalFound: data.data.diaServerResponse[0].response.numFound,
        data: responseItems,
        countryFilters: parseMultLangFilter(
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_country.map(
            ([joinedLangStr]) => joinedLangStr.replace(/\^/g, "|")
          )
        ),
        modalityFilter: mapToFilterItems(
          data.data.diaServerResponse[0].response.docs
        ),
        descriptorFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.descriptor_filter.map(
            (c) => {
              return { count: parseInt(c[1]), type: c[0] };
            }
          ),
        eventTypeFilter: parseMultLangFilter(
          data.data.diaServerResponse[0].facet_counts.facet_fields.event_type
        ),
        publicationYearFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_year.map(
            (i) => {
              return { count: parseInt(i[1]), type: i[0] };
            }
          ),
      };

      return responseDto;
    } catch (error) {
      throw new Error("Error while searching events");
    }
  };

  public formatTags = (item: EventsItemsDto, language: string) => {
    const countries = item.countries;

    let countryTags = countries?.map((c) =>
      c.countryLangs.find((cl) => cl.lang === language)
    );

    let descriptors = item.descriptors
      ? getDescriptorTags(item.descriptors)
      : [];

    if (descriptors.length > 0) descriptors = descriptors.slice(0, 1);
    let regions: Array<TagItem> = [];
    if (countries) {
      regions = item.countries
        ? getRegionByCountry(
            countries.map(
              (c) =>
                c.countryLangs.filter((cl) => cl.lang === language)[0]
                  .countryName
            )
          ).map((c) => ({
            name: c,
            type: "region",
          }))
        : [];
    }
    let tags: any[] = [];
    if (countryTags) {
      let countryTagsMapped = countryTags.map((c) => ({
        name: c?.countryName ? c.countryName : "",
        type: "country",
      }));
      tags = descriptors.concat(countryTagsMapped);
    }

    if (regions.length > 0) {
      tags = tags.concat(regions);
    }
    return tags;
  };
}
