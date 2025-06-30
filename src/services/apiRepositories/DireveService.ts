import { EventsItemsDto, EventsServiceDto } from "../types/eventsDto";
import { getDescriptorTags, getRegionByCountry } from "@/components/feed/utils";
import { mapToFilterItems, parseMultLangFilter } from "./utils";

import { RepositoryApiResponse } from "../types/repositoryTypes";
import { TagItem } from "@/components/feed/resourceitem";
import axios from "axios";
import { lang } from "moment";
import { queryType } from "../types/resources";

export class DireveService {
  public getResources = async (
    count: number,
    start: number,
    queryItems?: Array<queryType>,
    language?: string
  ): Promise<EventsServiceDto> => {
    try {
      let query = undefined;
      let q = undefined;

      //Adicionar o filtro de thematic area aqui
      query = `thematic_area:"TMGL"${
        queryItems
          ? queryItems
              .map((k) => {
                return `${k.parameter}:"${k.query.replace('"', "")}"`;
              })
              .join("&")
          : ""
      }`;
      q = "*:*";

      const { data } = await axios.post<RepositoryApiResponse>("/api/direve", {
        query,
        count,
        start,
        q,
        lang: language,
      });

      let responseItems: EventsItemsDto[] = [];

      if (data) {
        console.log(data);
        responseItems = data.data.diaServerResponse[0].response.docs.map(
          (event: any) => {
            return {
              id: event.id,
              title: event.title,
              observations: event.observations?.join(" , "),
              location: event.location,
              date: event.date,
              countries: [event.country],
              target_groups: event.target_groups,
              descriptors: event.descriptor,
              modality: event.event_modality,
              links: [
                {
                  label: "Event Link",
                  url: event.link,
                },
              ],
            };
          }
        );
      }

      let responseDto: EventsServiceDto = {
        totalFound: data.data.diaServerResponse[0].response.numFound,
        data: responseItems,
        countryFilters:
          data.data.diaServerResponse[0].facet_counts.facet_fields.country.map(
            (c) => {
              return { count: parseInt(c[1]), type: c[0] };
            }
          ),
        modalityFilter: mapToFilterItems(
          data.data.diaServerResponse[0].response.docs
        ),
        descriptorFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.descriptor_filter.map(
            (c) => {
              return { count: parseInt(c[1]), type: c[0] };
            }
          ),
        eventTypeFilter: parseMultLangFilter(
          data.data.diaServerResponse[0].facet_counts.facet_fields.event_type
        ),
        publicationYearFilter:
          data.data.diaServerResponse[0].facet_counts.facet_fields.publication_year.map(
            (i) => {
              return { count: parseInt(i[1]), type: i[0] };
            }
          ),
      };

      return responseDto;
    } catch (error) {
      console.log(error);
      throw new Error("Error while searching events");
    }
  };

  public formatTags = (item: EventsItemsDto, language: string) => {
    const countries = item.countries;
    let countryTags = countries?.map((c) => {
      return { name: c, type: "country" };
    });

    let descriptors = item.descriptors
      ? getDescriptorTags(item.descriptors)
      : [];

    if (descriptors.length > 0) descriptors = descriptors.slice(0, 1);
    let regions: Array<TagItem> = [];
    if (countries) {
      regions = item.countries
        ? getRegionByCountry(countries).map((c) => ({
            name: c,
            type: "region",
          }))
        : [];
    }
    let tags: any[] = [];
    if (countryTags) {
      tags = descriptors.concat(countryTags);
    }

    if (regions.length > 0) {
      tags = tags.concat(regions);
    }
    return tags;
  };
}
