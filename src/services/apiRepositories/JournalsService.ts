import {
  JournalApiDto,
  JournalItemDto,
  JournalServiceDto,
} from "../types/journalsDto";
import {
  applyDefaultResourceFilters,
  mapJoinedMultLangArrayToFilterItem,
  parseJournalCountries,
  parseMultLangFilter,
  parseMultLangStringAttr,
} from "./utils";
import {
  getCountryTags,
  getDescriptorTags,
  getRegionByCountry,
} from "@/components/feed/utils";

import { DefaultResourceDto } from "../types/defaultResource";
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

  public getDefaultResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    baseFilter?: string,
    souceType?: string
  ): Promise<DefaultResourceDto> => {
    const allResults = await Promise.all([
      this.getTitleResources(10000, 0, lang, [], false, baseFilter, souceType),
    ]);

    const mergedData = allResults.flatMap((r) => r.data);

    let orderedData = mergedData.sort((a, b) => {
      const yearA = parseInt(a.year || "0");
      const yearB = parseInt(b.year || "0");
      return yearB - yearA;
    });

    if (queryItems) {
      orderedData = applyDefaultResourceFilters(queryItems, orderedData);
    }
    const paginated = orderedData.slice(start, start + count);

    return {
      data: paginated,
      totalFound: orderedData.length,
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

  public getTitleResources = async (
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

    const { data } = await axios.post<RepositoryApiResponse>(`/api/journals`, {
      query,
      count,
      start,
      q,
    });
    if (data) {
      return {
        data: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            excerpt:
              parseMultLangStringAttr(d.description ? d.description : []).find(
                (i) => i.lang == lang
              )?.content || "",
            id: d.django_id,
            link: d.link ? d.link[0] : "",
            title: d.title,
            country: d.country
              ? parseMultLangStringAttr(
                  d.country.split("|").map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            documentType: "Journals",
            thematicArea: d.descriptor,
            region: d.country
              ? getRegionByCountry([
                  parseMultLangStringAttr(
                    d.country[0].split("|").map((i) => i.replace("^", "|"))
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
            type: "Internet Resources",
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
