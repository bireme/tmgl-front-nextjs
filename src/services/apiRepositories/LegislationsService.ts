import {
  LegislationItemDto,
  LegislationServiceDto,
} from "../types/legislationsDto";
import {
  parseCountries,
  parseCountriesByAttr,
  parseMultLangFilter,
  parseTematicAreas,
  parseThematicAreabyAttr,
} from "./utils";

import { PostsApi } from "../posts/PostsApi";
import { RepositoryApiResponse } from "../types/repositoryTypes";
import axios from "axios";
import { getDescriptorTags } from "@/components/feed/utils";
import moment from "moment";
import { queryType } from "../types/resources";

export class LegislationService {
  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<LegislationServiceDto> => {
    let query = undefined;
    let q = undefined;

    query = `thematic_area:"TMGL-EV"${and ? "&" : ""}${
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
      `/api/legislations`,
      {
        query,
        count,
        start,
        q,
      }
    );
    console.log(data);

    let responseItems: LegislationItemDto[] = [];
    const postsApi = new PostsApi();
    if (data) {
      let resources = await postsApi.getPostByAcfMetaKey(
        "resource",
        "resource_type",
        "legislation"
      );
      responseItems = data.data.diaServerResponse[0].response.docs.map(
        (item) => {
          let itemResources = resources.filter(
            (i: any) => i.acf.resource_id == item.django_id
          );
          itemResources = itemResources
            ? itemResources.length > 0
              ? itemResources[0]
              : null
            : null;
          return {
            created_date: item.created_date,
            descriptor: item.descriptor,
            django_ct: item.django_ct,
            django_id: item.django_id,
            fulltext: item.fulltext,
            id: item.id,
            indexed_database: item.indexed_database,
          };
        }
      );
    }
    console.log(data.data.diaServerResponse);
    let responseDto: LegislationServiceDto = {
      totalFound: data.data.diaServerResponse[0].response.numFound,
      data: responseItems,
      languageFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields.language
      ),
      countryFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields
          .publication_country
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

  public getItem = async (id: string): Promise<EvidenceMapItemDto> => {
    const { data } = await axios.post<EvidenceMapApiDto>(`/api/legislations`, {
      id,
    });

    if (data) {
      let item = data.data;
      let responseItem: EvidenceMapItemDto;
      const postsApi = new PostsApi();
      let resources = await postsApi.getPostByAcfMetaKey(
        "resource",
        "resource_id",
        item.id.toString()
      );
      if (resources.length > 0) resources = resources[0];
      responseItem = {
        id: item.id.toString(),
        created_at: moment(item.created_time).toDate(),
        updated_at: moment(item.updated_time).toDate(),
        title: item.title,
        excerpt: item.abstract,
        links: item.link,
        releatedDocuments:
          resources && resources.acf?.links
            ? resources.acf?.links?.map((l: any) => {
                return {
                  label: l.label,
                  content: l.tipo == "Link" ? l.link : l.file,
                  url: l.tipo == "Link" ? l.link : l.file,
                };
              })
            : [],
        countries: parseCountriesByAttr(item.publication_country),
        areas: parseThematicAreabyAttr(item.thematic_areas),
        descriptors: item.descriptors?.map((i) => i.text),
      };
      return responseItem;
    }
    throw new Error("Not Found");
  };

  public formatTags = (item: EvidenceMapItemDto, language: string) => {
    let descriptors = item.descriptors
      ? getDescriptorTags(item.descriptors)
      : [];

    if (descriptors.length > 0) descriptors = descriptors.slice(0, 1);
    let tags = descriptors;
    return tags;
  };
}
