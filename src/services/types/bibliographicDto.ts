import { FilterItem, MultLangFilter } from "./resources";

export interface BibliographicServiceDto {
  data: BibliographicItemDto[];
  countryFilters: MultLangFilter[];
  actTypeFilters: MultLangFilter[];
  publicationYearFilter: FilterItem[];
  totalFound: number;
}

export interface BibliographicFacetEntry {
  value: string;
  count: number;
}

export interface BibliographicFacetFields {
  act_type: any[];
  aggregation_level: any[];
  audience: any[];
  collection: any[];
  country: any[];
  course_type: any[];
  database: [string, number][];
  descriptor_filter: [string, number][];
  event_type: any[];
  format: any[];
  indexed_database: [string, number][];
  institution_thematic: any[];
  institution_type: any[];
  journal: [string, number][];
  language: any[];
  learning_context: any[];
  learning_resource_type: any[];
  license: any[];
  media_collection_filter: any[];
  media_type_filter: any[];
  publication_country: [string, number][];
  publication_language: [string, number][];
  publication_type: [string, number][];
  publication_year: [string, number][];
  scope: any[];
  scope_region: any[];
  scope_state: any[];
  status: [string, number][];
  tec_resource_type: any[];
  thematic_area_display: any[];
  type: any[];
}

export interface BibliographicFacetCounts {
  facet_dates: Record<string, any>;
  facet_fields: BibliographicFacetFields;
  facet_heatmaps: Record<string, any>;
  facet_intervals: Record<string, any>;
  facet_queries: Record<string, any>;
  facet_ranges: Record<string, any>;
}

export interface BibliographicItemDto {
  _version_: number;
  abstract_language?: string[];
  author?: string[];
  created_date: string;
  database: string[];
  django_ct: string;
  django_id: string;
  english_title?: string;
  id: string;
  indexed_database: string[];
  link: string[];
  mh?: string[];
  mj?: string[];
  publication_country: string[];
  publication_date: string;
  publication_language: string[];
  publication_type: string[];
  publication_year: string;
  reference_abstract?: string[];
  reference_title: string[];
  status: number;
  updated_date: string;
}

export interface BibliographicResponse {
  docs: BibliographicItemDto[];
  numFound: number;
  start: number;
}

export interface BibliographicResponseHeaderParams {
  fq: string;
  json_nl: string;
  q: string;
  sort: string;
  wt: string;
}

export interface BibliographicResponseHeader {
  QTime: number;
  params: BibliographicResponseHeaderParams;
  status: number;
}

export interface BibliographicResultItem {
  facet_counts: BibliographicFacetCounts;
  response: BibliographicResponse;
  responseHeader: BibliographicResponseHeader;
}

export interface BibliographicServerResponseDTO {
  data: {
    diaServerResponse: BibliographicResultItem[];
  };
}
