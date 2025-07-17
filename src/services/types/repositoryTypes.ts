export interface RepositoryApiResponse {
  data: {
    diaServerResponse: DiaServerResponse[];
  };
}

export interface FacetField {
  name: string;
  count: number;
}

export interface DiaServerResponse {
  facet_counts: FacetCounts;
  response: ApiResponse;
  responseHeader: ResponseHeader;
}

export interface FacetCounts {
  facet_dates: Record<string, unknown>;
  facet_fields: FacetFields;
  facet_heatmaps: Record<string, unknown>;
  facet_intervals: Record<string, unknown>;
  facet_queries: Record<string, unknown>;
  facet_ranges: Record<string, unknown>;
}

export interface FacetFields {
  act_type: Array<String>;
  aggregation_level: Array<String>;
  audience: Array<String>;
  collection: Array<String>;
  country: Array<String>;
  course_type: Array<String>;
  database: Array<String>;
  descriptor_filter: Array<String>;
  event_type: Array<String>;
  format: Array<String>;
  indexed_database: Array<String>;
  institution_thematic: Array<String>;
  institution_type: Array<String>;
  journal: Array<String>;
  language: Array<String>;
  learning_context: Array<String>;
  learning_resource_type: Array<String>;
  license: Array<String>;
  media_collection_filter: Array<String>;
  media_type_filter: Array<String>;
  publication_country: [string, number][];
  publication_language: Array<String>;
  publication_type: Array<String>;
  publication_year: Array<String>;
  scope: Array<String>;
  scope_region: Array<String>;
  scope_state: Array<String>;
  status: Array<String>;
  tec_resource_type: Array<String>;
  thematic_area_display: Array<String>;
  type: Array<String>;
}

export interface ApiResponse {
  docs: LisDocuments[];
  numFound: number;
  start: number;
}

export interface LisDocuments {
  _version_: number;
  abstract: string;
  created_date: string;
  descriptor: string[];
  django_ct: string;
  country?: string;
  django_id: string;
  id: string;
  logo_image_file?: string;
  description?: string[];
  language: string[];
  link: string[];
  mh: string[];
  originator: string[];
  source_language: string[];
  source_language_display: string[];
  source_type: string[];
  source_type_display: string[];
  status: number;
  thematic_area: string[];
  publication_country?: string[];
  thematic_area_display: string[];
  title: string;
  updated_date: string;
  fulltext: string[];
  event_modality: string[];
}

export interface ResponseHeader {
  QTime: number;
  params: ResponseParams;
  status: number;
}

export interface ResponseParams {
  fq: string;
  "json.nl": string;
  q: string;
  qt: string;
  sort: string;
  wt: string;
}
