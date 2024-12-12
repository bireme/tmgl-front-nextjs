export interface RepositoryApiResponse {
  data: {
    diaServerResponse: DiaServerResponse[];
  };
}

interface FacetField {
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
  act_type: FacetField[];
  aggregation_level: FacetField[];
  audience: FacetField[];
  collection: FacetField[];
  country: FacetField[];
  course_type: FacetField[];
  database: FacetField[];
  descriptor_filter: FacetField[];
  event_type: FacetField[];
  format: FacetField[];
  indexed_database: FacetField[];
  institution_thematic: FacetField[];
  institution_type: FacetField[];
  journal: FacetField[];
  language: FacetField[];
  learning_context: FacetField[];
  learning_resource_type: FacetField[];
  license: FacetField[];
  media_collection_filter: FacetField[];
  media_type_filter: FacetField[];
  publication_country: FacetField[];
  publication_language: FacetField[];
  publication_type: FacetField[];
  publication_year: FacetField[];
  scope: FacetField[];
  scope_region: FacetField[];
  scope_state: FacetField[];
  status: FacetField[];
  tec_resource_type: FacetField[];
  thematic_area_display: FacetField[];
  type: FacetField[];
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
  django_id: string;
  id: string;
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
  thematic_area_display: string[];
  title: string;
  updated_date: string;
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
