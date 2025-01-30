import {
  EvidenceMapItemDto,
  EvidenceMapsServiceDto,
} from "../types/evidenceMapsDto";
import {
  getCountryTags,
  getDescriptorTags,
  getRegionByCountry,
} from "@/components/feed/utils";
import {
  parseCountries,
  parseMultLangFilter,
  parseTematicArea,
  parseTematicAreas,
} from "./utils";

import { RepositoryApiResponse } from "../types/RepositoryTypes";
import { TagItem } from "@/components/feed/resourceitem";
import axios from "axios";
import moment from "moment";
import { queryType } from "../types/resources";

export class EvidenceMapsService {
  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>
  ): Promise<EvidenceMapsServiceDto> => {
    let query = undefined;
    let q = undefined;

    query = `thematic_area:"TMGL-EV"${
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
}
