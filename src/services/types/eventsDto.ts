import {
  Area,
  Country,
  CountryData,
  FilterItem,
  MultLangFilter,
} from "./resources";

export interface EventsServiceDto {
  data: EventsItemsDto[];
  totalFound: number;
  countryFilters: MultLangFilter[];
  descriptorFilter: FilterItem[];
  eventTypeFilter: MultLangFilter[];
  publicationYearFilter: FilterItem[];
  modalityFilter: FilterItem[];
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
  countries?: Country[];
  areas?: Area[];
  modality: string[];
}

export interface EventLink {
  label: string;
  url: string;
}
