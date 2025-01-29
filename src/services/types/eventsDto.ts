import { Area, Country, FilterItem, MultLangFilter } from "./resources";

export interface EventsServiceDto {
  data: EventsItemsDto[];
  totalFound: number;
  countryFilters: FilterItem[];
  descriptorFilter: FilterItem[];
  eventTypeFilter: MultLangFilter[];
}

export interface EventsItemsDto {
  title: string;
  location: string;
  date: string;
  links: EventLink[];
  id: string;
  target_groups: string;
  observations: string;
  descriptors: string[];
  countries?: string[];
  areas?: Area[];
  modality: string[];
}

export interface EventLink {
  label: string;
  url: string;
}
