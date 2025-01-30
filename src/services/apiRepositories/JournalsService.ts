import { JournalItemDto, JournalServiceDto } from "../types/JournalsDto";
import {
  getCountryTags,
  getDescriptorTags,
  getRegionByCountry,
} from "@/components/feed/utils";
import {
  parseCountries,
  parseJournalCountries,
  parseMultLangFilter,
  parseTematicAreas,
} from "./utils";

import { EvidenceMapItemDto } from "../types/evidenceMapsDto";
import { RepositoryApiResponse } from "../types/RepositoryTypes";
import { TagItem } from "@/components/feed/resourceitem";
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
    q = "*:*";
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
            descriptors: item.descriptor,
            countries: parseJournalCountries(item),
            created_at: moment(item?.created_date, "YYYYMMDD").toDate(),
            updated_at: moment(item?.updated_date, "YYYYMMDD").toDate(),
          };
        }
      );
    }

    let responseDto: JournalServiceDto = {
      data: responseItems,
      totalFound: data.data.diaServerResponse[0].response.numFound,
      languageFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields.language
      ),
      countryFilters: parseMultLangFilter(
        data.data.diaServerResponse[0].facet_counts.facet_fields.country
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
}
