import {
  applyDefaultResourceFilters,
  mapBibliographicTypes,
  mapJoinedMultLangArrayToFilterItem,
  mergeFilterItems,
  parseMultLangStringAttr,
} from "./utils";

import { BibliographicServerResponseDTO } from "../types/bibliographicDto";
import { DefaultResourceDto } from "../types/defaultResource";
import { LegislationServerResponseDTO } from "../types/legislationsTypes";
import { LisService } from "./LisService";
import { MultimediaService } from "./MultimediaService";
import axios from "axios";
import { getRegionByCountry } from "@/components/feed/utils";
import { queryType } from "../types/resources";

export class GlobalSummitService {
  public getResources = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<DefaultResourceDto> => {
    const multimediaService = new MultimediaService();
    const lisService = new LisService();

    const allResults = await Promise.all([
      this.getBibliographic(10000, 0, lang!),
      multimediaService.getMultimediaResource(
        10000,
        0,
        lang!,
        [],
        false,
        "GTMSummit"
      ),
      this.getLegislations(10000, 0, lang!),
      lisService.getLisResources(10000, 0, lang!, [], false, "GTMSummit"),
    ]);

    const mergedData = allResults.flatMap((r) => r.data);

    const orderedData = mergedData.slice().sort((a, b) => {
      const yA = Number.parseInt(a.year ?? "0", 10) || 0;
      const yB = Number.parseInt(b.year ?? "0", 10) || 0;
      if (yA !== yB) return yB - yA;

      const aKey = (a.id ?? a.title ?? a.excerpt ?? "")
        .toString()
        .toLowerCase();
      const bKey = (b.id ?? b.title ?? b.excerpt ?? "")
        .toString()
        .toLowerCase();
      return aKey.localeCompare(bKey);
    });

    const filtered = queryItems
      ? applyDefaultResourceFilters(queryItems, orderedData)
      : orderedData;
    const pageSize = Math.max(0, count);
    const window = filtered.slice(start, start + pageSize + 1);
    const hasNext = window.length > pageSize;
    const paginated = hasNext ? window.slice(0, pageSize) : window;

    return {
      data: paginated,
      totalFound: orderedData.length,
      countryFilter: mergeFilterItems(
        allResults[0].countryFilter,
        allResults[1].countryFilter,
        allResults[2].countryFilter,
        allResults[3].countryFilter
      ).sort((a, b) => a.type.localeCompare(b.type)),
      documentTypeFilter: mergeFilterItems(
        allResults[0].documentTypeFilter,
        allResults[1].documentTypeFilter,
        allResults[2].documentTypeFilter,
        allResults[3].documentTypeFilter
      ).sort((a, b) => a.type.localeCompare(b.type)),
      eventFilter: [],
      regionFilter: mergeFilterItems(allResults[0].regionFilter),
      thematicAreaFilter: mergeFilterItems(
        allResults[0].thematicAreaFilter,
        allResults[1].thematicAreaFilter,
        allResults[2].thematicAreaFilter,
        allResults[3].thematicAreaFilter
      ).sort((a, b) => a.type.localeCompare(b.type)),
      yearFilter: mergeFilterItems(
        allResults[0].yearFilter,
        allResults[1].yearFilter,
        allResults[2].yearFilter,
        allResults[3].yearFilter
      ).sort((a, b) => Number(a.type) + Number(b.type)),
    };
  };

  public getBibliographic = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<DefaultResourceDto> => {
    let query = undefined;
    let q = undefined;
    query = `database:"GTM Summit - The First WHO Tradicional Medicine Global Summit"${
      and ? "&" : ""
    }${
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
    if (data) {
      return {
        data: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            excerpt: d.reference_abstract ? d.reference_abstract[0] : "",
            title: d.reference_title[0],
            id: d.id,
            link: d.link ? d.link[0] : "",
            country: d.publication_country
              ? parseMultLangStringAttr(
                  d.publication_country[0]
                    .split("|")
                    .map((i) => i.replace("^", "|"))
                ).find((i) => i.lang == lang)?.content
              : "",
            documentType: mapBibliographicTypes(d.publication_type[0]),
            year: d.publication_year,
            thematicArea: d.mh,
            region: d.publication_country
              ? getRegionByCountry([
                  parseMultLangStringAttr(
                    d.publication_country[0]
                      .split("|")
                      .map((i) => i.replace("^", "|"))
                  ).find((i) => i.lang == lang)?.content || "",
                ])[0]
              : "",
          };
        }),
        countryFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields
            .publication_country,
          lang
        ),
        documentTypeFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_type.map(
            (t) => {
              return {
                type: mapBibliographicTypes(t[0]),
                count: t[1],
              };
            }
          ),
        eventFilter: [],
        regionFilter: getRegionByCountry(
          mapJoinedMultLangArrayToFilterItem(
            data.data.diaServerResponse[0].facet_counts.facet_fields
              .publication_country,
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
                count: t[1],
              };
            }
          ),
        yearFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_year.map(
            (t) => {
              return {
                type: t[0],
                count: t[1],
              };
            }
          ),
        totalFound: data.data.diaServerResponse[0].response.numFound,
      };
    }
    return {
      data: [],
      countryFilter: [],
      documentTypeFilter: [],
      eventFilter: [],
      regionFilter: [],
      thematicAreaFilter: [],
      yearFilter: [],
      totalFound: 0,
    };
  };

  public getLegislations = async (
    count: number,
    start: number,
    lang: string,
    queryItems?: Array<queryType>,
    and?: boolean
  ): Promise<DefaultResourceDto> => {
    let query = undefined;
    let q = undefined;
    query = `indexed_database:"TMGL-Africa"${and ? "&" : ""}${
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
    if (data) {
      return {
        data: data.data.diaServerResponse[0].response.docs.map((d) => {
          return {
            excerpt: d.official_ementa[0],
            id: d.id,
            link: d.fulltext[0].split("|")[1],
            title: d.title,
            country: parseMultLangStringAttr(
              d.scope_region[0].split("|").map((i) => i.replace("^", "|"))
            ).find((i) => i.lang == lang)?.content,
            documentType: "Legislation",
            thematicArea: d.descriptor,
            region: getRegionByCountry([
              parseMultLangStringAttr(
                d.scope_region[0].split("|").map((i) => i.replace("^", "|"))
              ).find((i) => i.lang == lang)?.content || "",
            ])[0],
            year: d.publication_year,
          };
        }),
        countryFilter: mapJoinedMultLangArrayToFilterItem(
          data.data.diaServerResponse[0].facet_counts.facet_fields.scope_region,
          lang
        ),
        documentTypeFilter: [
          {
            type: "Legislation",
            count: data.data.diaServerResponse[0].response.numFound,
          },
        ],
        eventFilter: [],
        regionFilter: getRegionByCountry(
          mapJoinedMultLangArrayToFilterItem(
            data.data.diaServerResponse[0].facet_counts.facet_fields
              .scope_region,
            lang
          ).map((c) => c.type)
        ).map((r) => {
          return { type: r, count: 99 };
        }),
        thematicAreaFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.thematic_area_display.map(
            (i) => {
              let type = i[0]
                .split("|")
                .map((i) => i.replace("^", "|"))
                .find((i) => i[0] == lang);
              return {
                type: type ? type : "",
                count: parseInt(i[1]),
              };
            }
          ),
        yearFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_year.map(
            (y) => {
              return { type: y[0], count: parseInt(y[1]) };
            }
          ),
        totalFound: data.data.diaServerResponse[0].response.numFound,
      };
    }
    return {
      data: [],
      countryFilter: [],
      documentTypeFilter: [],
      eventFilter: [],
      regionFilter: [],
      totalFound: 0,
      thematicAreaFilter: [],
      yearFilter: [],
    };
  };
}
