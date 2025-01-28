import { JournalItemDto, JournalServiceDto } from "../types/JournalsDto";
import { parseCountries, parseMultLangFilter } from "./utils";

import { EvidenceMapItemDto } from "../types/evidenceMapsDto";
import { RepositoryApiResponse } from "../types/RepositoryTypes";
import axios from "axios";
import moment from "moment";
import { queryType } from "../types/resources";

export class JournalsService {
  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>
  ): Promise<JournalServiceDto> => {
    let query = undefined;
    let q = undefined;

    query = `${
      queryItems
        ? queryItems
            .map((k) => {
              return `${k.parameter}:"${k.query}"`;
            })
            .join("&")
        : ""
    }`;
    q = "AND";
    const { data } = await axios.post<RepositoryApiResponse>(`/api/journals`, {
      query,
      count,
      start,
      q,
    });

    let responseItems: JournalItemDto[] = [];
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
          };
        }
      );
    }

    let responseDto: JournalServiceDto = {
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
}
