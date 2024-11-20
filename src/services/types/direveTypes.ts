interface FacetField {
  name: string;
  count: number;
}

interface FacetCounts {
  facet_dates: Record<string, unknown>;
  facet_fields: {
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
  };
  facet_heatmaps: Record<string, unknown>;
  facet_intervals: Record<string, unknown>;
  facet_queries: Record<string, unknown>;
  facet_ranges: Record<string, unknown>;
}

interface Document {
  _version_: number;
  address: string[];
  city: string;
  contact_email: string;
  country: string;
  created_date: string;
  descriptor: string[];
  django_ct: string;
  django_id: string;
  end_date: string;
  event_modality: string[];
  event_type: string[];
  id: string;
  keyword: string[];
  link: string[];
  mh: string[];
  not_regional_event: string[];
  observations: string[];
  official_language: string[];
  official_language_display: string[];
  publication_year: string;
  start_date: string;
  status: number;
  target_groups: string[];
  thematic_area: string[];
  thematic_area_display: string[];
  title: string;
  updated_date: string;
}

interface Response {
  docs: Document[];
  numFound: number;
  start: number;
}

interface ResponseHeaderParams {
  "facet.method": string;
  fq: string;
  "json.nl": string;
  q: string;
  qt: string;
  sort: string;
  wt: string;
}

interface ResponseHeader {
  QTime: number;
  params: ResponseHeaderParams;
  status: number;
}

interface DiaServerResponse {
  facet_counts: FacetCounts;
  response: Response;
  responseHeader: ResponseHeader;
}

export interface ApiResponse {
  diaServerResponse: DiaServerResponse[];
}
