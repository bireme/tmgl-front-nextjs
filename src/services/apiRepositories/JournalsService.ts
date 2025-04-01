import {
  JournalApiDto,
  JournalItemDto,
  JournalServiceDto,
} from "../types/journalsDto";
import {
  getCountryTags,
  getDescriptorTags,
  getRegionByCountry,
} from "@/components/feed/utils";
import {
  parseJournalCountries,
  parseMultLangFilter,
  parseMultLangStringAttr,
} from "./utils";

import { EvidenceMapItemDto } from "../types/evidenceMapsDto";
import { RepositoryApiResponse } from "../types/repositoryTypes";
import { TagItem } from "@/components/feed/resourceitem";
import axios from "axios";
import moment from "moment";
import { queryType } from "../types/resources";

export class JournalsService {
  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    lang?: string
  ): Promise<JournalServiceDto> => {
    let query = undefined;
    let q = undefined;
    const countryQueryCount = queryItems?.filter(
      (q) => q.parameter == "country"
    ).length
      ? queryItems?.filter((q) => q.parameter == "country").length
      : 0;

    if (countryQueryCount <= 1)
      query = `thematic_area:"TMGL"${
        queryItems
          ? queryItems
              .map((k) => {
                return `${k.parameter}:"${k.query}"`;
              })
              .join("&")
          : ""
      }`;
    else {
      query = `thematic_area:"TMGL"${
        queryItems
          ? queryItems
              .filter((q) => q.parameter != "country")
              .map((k) => {
                return `${k.parameter}:"${k.query}"`;
              })
              .join("&")
          : ""
      }`;
    }
    q = "*:*";
    let { data } = await axios.post<RepositoryApiResponse>(`/api/journals`, {
      query,
      count,
      start,
      q,
      lang,
    });

    if (countryQueryCount > 1) {
    }

    let responseItems: JournalItemDto[] = [];
    if (data) {
      let respData = data.data.diaServerResponse[0].response.docs;
      if (countryQueryCount > 1) {
        let allData = await axios.post<RepositoryApiResponse>(`/api/journals`, {
          query,
          count: data.data.diaServerResponse[0].response.numFound,
          start,
          q,
          lang,
        });
        respData = allData.data.data.diaServerResponse[0].response.docs;

        respData = respData.filter((rd) =>
          queryItems
            ?.filter((q) => q.parameter == "country")
            .map((q) => q.query)
            .includes(rd.country ? rd.country : "")
        );
      }
      responseItems = respData.map((item) => {
        return {
          id: item.django_id,
          title: item.title,
          excerpt: item.abstract,
          links: item.link,
          logo: item.logo_image_file,
          descriptors: item.descriptor,
          countries: parseJournalCountries(item),
          created_at: moment(item?.created_date, "YYYYMMDD").toDate(),
          updated_at: moment(item?.updated_date, "YYYYMMDD").toDate(),
          description: item.description
            ? parseMultLangStringAttr(item.description)
            : undefined,
        };
      });
    }

    let responseDto: JournalServiceDto = {
      data: responseItems,
      indexFilters:
        data.data.diaServerResponse[0].facet_counts.facet_fields.indexed_database.map(
          (item) => {
            return {
              type: item[0],
              count: parseInt(item[1]),
            };
          }
        ),
      totalFound:
        countryQueryCount <= 1
          ? data.data.diaServerResponse[0].response.numFound
          : count, //Isso desativa a paginação quando o filtro é por região (pq o filtro é feito depois de receber os dados a paginação não funcionaria)
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

  public getItem = async (
    id: string,
    lang?: string
  ): Promise<JournalItemDto> => {
    const searchLang = lang ? lang : "en";
    const { data } = await axios.post<JournalApiDto>(`/api/journals`, {
      id,
      lang: searchLang,
    });
    const multData = await axios.post<RepositoryApiResponse>(`/api/journals`, {
      query: `django_id:${id}`,
      count: 1,
      start: 0,
      q: "*:*",
      searchLang,
    });

    if (data) {
      const item = data.data;
      const multSearchItem =
        multData.data?.data?.diaServerResponse[0]?.response?.docs;
      const responseItem: JournalItemDto = {
        id: item.id_number,
        title: item.title,
        excerpt: multSearchItem[0].abstract,
        descriptors: item.descriptors
          ? item.descriptors
          : multSearchItem[0].descriptor,
        created_at: moment(item?.created_time, "YYYYMMDD").toDate(),
        updated_at: moment(item?.updated_time, "YYYYMMDD").toDate(),
        description: multSearchItem
          ? multSearchItem[0].description
            ? parseMultLangStringAttr(multSearchItem[0].description)
            : undefined
          : undefined,
        countries: parseJournalCountries(multSearchItem[0]),
        links: multSearchItem[0].link,
        logo: multSearchItem[0].logo_image_file,
        issn: item.issn,
        responsibility_mention: item.responsibility_mention,
        coverage:
          item.initial_date || item.final_date
            ? item.initial_date + "-" + item.final_date
            : undefined,
        language: multSearchItem[0].language
          ? multSearchItem[0].language.flatMap((i) => {
              return i.split("|").map((l) => {
                const [lang, content] = l.split("^");
                return { lang, content };
              });
            })
          : undefined,
      };
      return responseItem;
    }
    throw new Error("Cant find journal");
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
