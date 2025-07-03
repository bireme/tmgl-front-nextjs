import {
  LegislationItemDto,
  LegislationServiceDto,
} from "../types/legislationsDto";

import { LegislationServerResponseDTO } from "../types/legislationsTypes";
import { PostsApi } from "../posts/PostsApi";
import axios from "axios";
import moment from "moment";
import { parseMultLangFilter } from "./utils";
import { queryType } from "../types/resources";

export class RegulationAndPolicesService {
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
    const { data } = await axios.post<LegislationServerResponseDTO>(
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
      responseItems = data.diaServerResponse[0].response.docs.map((item) => {
        let itemResources = resources.filter(
          (i: any) => i.acf.resource_id == item.django_id
        );
        itemResources = itemResources
          ? itemResources.length > 0
            ? itemResources[0]
            : null
          : null;
        return {
          title: item.reference_title[0],
          django_id: item.django_id,
          id: item.id,
          act_scope: item.scope,
          act_number: item.act_number,
          act_type: item.act_type,
          official_ementa: item.official_ementa,
          unofficial_ementa: "",
          fulltext: item.fulltext,
          collection: "",
          language: item.language,
          publication_date: moment(
            item.publication_date,
            "YYYY-MM-DD"
          ).toDate(),
          publication_country: "",
          source_name: item.source_name,
          scope_region: item.scope_region,
          scope_state: item.scope_state,
          status: item.status,
          thematic_area: item.thematic_area,
          thematic_area_display: item.thematic_area_display,
          issuer_organ: item.issuer_organ,
          descriptor: item.descriptor ? item.descriptor : [],
          file: item.fulltext[0],
          indexed_in: item.indexed_database[0],
          indexed_database: item.indexed_database,
          created_date: item.created_date,
          updated_date: moment(item.updated_date, "YYYY-MM-DD").toDate(),
          publication_year: item.publication_year,
          descriptor_tags: item.descriptor,
          resources: itemResources,
          organ_issuer: item.issuer_organ,
          scope_city: item.scope_city,
          scope: item.scope,
        };
      });
    }

    let responseDto: LegislationServiceDto = {
      totalFound: data.diaServerResponse[0].response.numFound,
      data: responseItems,
      countryFilters: parseMultLangFilter(
        data.diaServerResponse[0].facet_counts.facet_fields.country
      ),
      actTypeFilters: parseMultLangFilter(
        data.diaServerResponse[0].facet_counts.facet_fields.act_type
      ),
      publicationYearFilter:
        data.diaServerResponse[0].facet_counts.facet_fields.publication_year.map(
          (k: any) => {
            return k;
          }
        ),
    };
    return responseDto;
  };

  // public getItem = async (id: string): Promise<EvidenceMapItemDto> => {
  //   const { data } = await axios.post<EvidenceMapApiDto>(`/api/legislations`, {
  //     id,
  //   });

  //   if (data) {
  //     let item = data.data;
  //     let responseItem: EvidenceMapItemDto;
  //     const postsApi = new PostsApi();
  //     let resources = await postsApi.getPostByAcfMetaKey(
  //       "resource",
  //       "resource_id",
  //       item.id.toString()
  //     );
  //     if (resources.length > 0) resources = resources[0];
  //     responseItem = {
  //       id: item.id.toString(),
  //       created_at: moment(item.created_time).toDate(),
  //       updated_at: moment(item.updated_time).toDate(),
  //       title: item.title,
  //       excerpt: item.abstract,
  //       links: item.link,
  //       releatedDocuments:
  //         resources && resources.acf?.links
  //           ? resources.acf?.links?.map((l: any) => {
  //               return {
  //                 label: l.label,
  //                 content: l.tipo == "Link" ? l.link : l.file,
  //                 url: l.tipo == "Link" ? l.link : l.file,
  //               };
  //             })
  //           : [],
  //       countries: parseCountriesByAttr(item.publication_country),
  //       areas: parseThematicAreabyAttr(item.thematic_areas),
  //       descriptors: item.descriptors?.map((i) => i.text),
  //     };
  //     return responseItem;
  //   }
  //   throw new Error("Not Found");
  // };

  // public formatTags = (item: EvidenceMapItemDto, language: string) => {
  //   let descriptors = item.descriptors
  //     ? getDescriptorTags(item.descriptors)
  //     : [];

  //   if (descriptors.length > 0) descriptors = descriptors.slice(0, 1);
  //   let tags = descriptors;
  //   return tags;
  // };
}
