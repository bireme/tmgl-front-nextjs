import { FacetCounts, ResponseHeader } from "./repositoryTypes";
import { FilterItem, MultLangFilter } from "./resources";

export interface Meta {
  limit: number;
  next: string;
  offset: number;
  previous: string | null;
  total_count: number;
}

export interface Descriptor {
  code: string;
  text: string;
}

export interface ThematicArea {
  code: string;
  text: string;
}

export interface MultimediaObject {
  authors: string[];
  content_notes: string;
  contributors: string[];
  cooperative_center_code: string;
  created_time: string;
  description: string[];
  descriptors: Descriptor[];
  dimension: string;
  id: number;
  item_extension: string;
  link: string;
  other_physical_details: string;
  publication_date: string;
  publisher: string;
  related_links: string[];
  status: number;
  media_type: string;
  thematic_areas: ThematicArea[];
  title: string;
  title_translated: string;
  updated_time: string | null;
  version_notes: string;
  thumbnail?: string;
}

export interface MultimediaResponseItems {
  docs: MultimediaObject[];
  numFound: number;
  start: number;
}

export interface MultimediaResponse {
  data: MultimediaResponseData;
}

export interface MultimediaResponseData {
  diaServerResponse: MultimediaDiaServerResponse[];
}

export interface MultimediaDiaServerResponse {
  facet_counts: FacetCounts;
  response: MultimediaResponseItems;
  responseHeader: ResponseHeader;
}

export interface MultimediaServiceDto {
  data: MultimediaObject[];
  regionFilters: FilterItem[];
  countryFilters: FilterItem[];
  typeFilters: MultLangFilter[];
  thematicAreaFilters: FilterItem[];
  languageFilters: FilterItem[];
  totalFound: number;
}
