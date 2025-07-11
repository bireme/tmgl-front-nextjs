import {
  BibliographicItemDto,
  BibliographicServerResponseDTO,
} from "../types/bibliographicDto";
import {
  LegislationItemDto,
  LegislationServiceDto,
} from "../types/legislationsDto";
import {
  RegulationAndPolicesItemDto,
  RegulationsAndPolicesDto,
} from "../types/regulationsAndPolices";
import { parseMultLangFilter, parseMultLangStringAttr } from "./utils";

import { LegislationServerResponseDTO } from "../types/legislationsTypes";
import { PostsApi } from "../posts/PostsApi";
import axios from "axios";
import moment from "moment";
import { queryType } from "../types/resources";

export class RegulationAndPolicesService {
  public getResources = async (
    count: number,
    start: number,
    totalLegislation: number,
    totalBibliographic: number,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<RegulationsAndPolicesDto> => {
    // Calcula quantos itens buscar de cada recurso
    const legislationCount = Math.min(count, totalLegislation - start);
    const bibliographicCount = Math.min(count, totalBibliographic - start);

    // Busca legislações e itens bibliográficos em paralelo
    const [
      { legislations, totalLegislationsFound },
      { bibliographics, totalBibliographicsFound },
    ] = await Promise.all([
      this.getLegislations(legislationCount, start, queryItems, and),
      this.getBibliographic(bibliographicCount, start, queryItems, and),
    ]);

    // Mapeia legislações para RegulationAndPolicesItemDto
    const legislationData: RegulationAndPolicesItemDto[] = legislations.map(
      (item) => ({
        act_scope: "",
        django_id: item.django_id ?? "",
        file: item.file ? item.file[0] : "",
        id: item.id ?? "",
        indexed_in: item.indexed_database ? item.indexed_database[0] : "",
        language: item.language
          ? parseMultLangStringAttr(
              item.language.split("|").map((i) => i.replace("^", "|"))
            )
          : [],
        organ_issuer: item.organ_issuer ? item.organ_issuer : [""],
        act_type: item.act_type ? item.act_type[0] : "",
        act_number: item.act_number ? item.act_number : [],
        act_country: item.scope_region
          ? parseMultLangStringAttr(
              item.scope_region.split("|").map((i) => i.replace("^", "|"))
            )
          : [],
        publication_date: item.publication_date
          ? moment(item.publication_date).toDate()
          : moment().toDate(),
        official_ementa: item.official_ementa
          ? parseMultLangStringAttr(item.official_ementa)
          : [],
        collection: item.collection ?? "",
        indexed_database: item.indexed_database ? item.indexed_database : [],
        title: item.title ?? "",
        unofficial_ementa: item.unofficial_ementa
          ? parseMultLangStringAttr([item.unofficial_ementa])
          : [],
        type: "legislation",
      })
    );

    // Mapeia itens bibliográficos para RegulationAndPolicesItemDto
    const bibliographicData: RegulationAndPolicesItemDto[] = bibliographics.map(
      (item) => ({
        act_scope: "",
        django_id: item.django_id ?? "",
        file: item.link ? item.link[0] : "",
        id: item.id ?? "",
        indexed_in: item.indexed_database ? item.indexed_database[0] : "",
        language: item.publication_language
          ? parseMultLangStringAttr(item.publication_language)
          : [],
        unofficial_ementa: item.abstract_language
          ? parseMultLangStringAttr(item.abstract_language)
          : [],
        organ_issuer: item.author ? item.author : [""],
        act_type: item.publication_type ? item.publication_type[0] : "",
        act_number: [],
        act_country: item.publication_country
          ? parseMultLangStringAttr(item.publication_country)
          : [],
        publication_date: item.created_date
          ? moment(item.created_date).toDate()
          : moment().toDate(),
        official_ementa: item.abstract_language
          ? parseMultLangStringAttr(item.abstract_language)
          : [],
        collection: "",
        indexed_database: item.indexed_database ? item.indexed_database : [],
        type: "bibliographic",
        title: item.english_title ? item.english_title : item.id,
      })
    );

    // Junta os dois arrays
    const data = [...legislationData, ...bibliographicData];

    // Soma os totais encontrados
    const totalFound =
      (totalLegislationsFound || 0) + (totalBibliographicsFound || 0);

    return {
      data,
      totalFound,
    };
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
            unofficial_ementa: item.unnofficial_ementa,
            fulltext: item.fulltext,
            collection: "",
            language: item.language ? item.language[0] : "",
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
  ): Promise<{
    bibliographics: BibliographicItemDto[];
    totalBibliographicsFound: number;
  }> => {
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

    let responseItems: BibliographicItemDto[] = [];
    if (data) {
      responseItems = data.data.diaServerResponse[0].response.docs.map(
        (item) => {
          return item;
        }
      );
    }
    return {
      bibliographics: responseItems,
      totalBibliographicsFound:
        data?.data.diaServerResponse[0].response.numFound,
    };
  };
}
