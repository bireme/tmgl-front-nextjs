import {
  LegislationItemDto,
  LegislationServiceDto,
} from "../types/legislationsDto";

import { LegislationServerResponseDTO } from "../types/legislationsTypes";
import { PostsApi } from "../posts/PostsApi";
import { RegulationsAndPolicesDto } from "../types/regulationsAndPolices";
import axios from "axios";
import moment from "moment";
import { parseMultLangFilter } from "./utils";
import { queryType } from "../types/resources";

export class RegulationAndPolicesService {
  public getResources = async (
    count: number,
    start: number,
    // totalLegislation: number,
    // totalBibliographic: number,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<RegulationsAndPolicesDto> => {
    //TODO: Dividir a páginação com base em totalLegilsation e TotalBibliographic

    const { legislations, totalLegislationsFound } = await this.getLegislations(
      count,
      start,
      queryItems,
      and
    );
    //TODO: Buscar Bibliographic

    const returnObject: RegulationsAndPolicesDto = {
      data: legislations.map((item) => {
        return {
          organ_issuer: item.organ_issuer,
          act_scope: item.act_scope,
          act_number: item.act_number,
          act_type: item.act_type,
          act_country: "", //Ainda não vem da API
          collection: item.collection,
          descriptor: item.descriptor,
          django_id: item.django_id,
          file: item.file,
          fulltext: item.fulltext,
          id: item.id,
          indexed_in: item.indexed_in,
          language: item.language,
          official_ementa: item.official_ementa ? item.official_ementa[0] : "",
          publication_date: item.publication_date,
          scope: item.scope,
          scope_region: item.scope_region,
          source_name: item.source_name,
          status: item.status,
          thematic_area: item.thematic_area,
          thematic_area_display: item.thematic_area_display,
          title: item.title,
          unofficial_ementa: item.unofficial_ementa,
        };
      }),
      totalFound: totalLegislationsFound,
    };
    return returnObject;
  };

  public getLegislations = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<{
    legislations: LegislationItemDto[];
    totalLegislationsFound: number;
  }> => {
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

    let responseItems: LegislationItemDto[] = [];
    if (data) {
      console.log(data);
      responseItems = data.data.diaServerResponse[0].response.docs.map(
        (item) => {
          return {
            title: item.title,
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
            file: item.fulltext ? item.fulltext[0].split("|")[1] : "",
            indexed_in: item.indexed_database[0],
            indexed_database: item.indexed_database,
            created_date: item.created_date,
            updated_date: moment(item.updated_date, "YYYY-MM-DD").toDate(),
            publication_year: item.publication_year,
            descriptor_tags: item.descriptor,
            organ_issuer: item.issuer_organ,
            scope_city: item.scope_city,
            scope: item.scope,
          };
        }
      );
    }
    return {
      legislations: responseItems,
      totalLegislationsFound: data?.data.diaServerResponse[0].response.numFound,
    };
  };

  public getBibliographic = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    and?: boolean
  ) => {};
}
