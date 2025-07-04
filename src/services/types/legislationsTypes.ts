import { FacetCounts } from "./repositoryTypes";

export interface LegislationServerResponseDTO {
  data: {
    diaServerResponse: LegislationServerItemDTO[];
  };
}

export interface LegislationServerItemDTO {
  facet_counts: FacetCounts;
  response: LegislationResponseDTO;
  responseHeader: LegislationResponseHeaderDTO;
}

export interface LegislationResponseDTO {
  docs: LegislationDocumentDTO[];
  numFound: number;
  start: number;
}

export interface LegislationResponseHeaderDTO {
  QTime: number;
  params: Record<string, string>;
  status: number;
}

export interface LegislationDocumentDTO {
  _version_: number;
  act_number: string[];
  act_type: string;
  created_date: string;
  django_ct: string;
  django_id: string;
  fulltext: string[];
  id: string;
  indexed_database: string[];
  issue_date: string[];
  issuer_organ: string[];
  language: string[];
  official_ementa: string[];
  publication_date: string;
  publication_year: string;
  title: string;
  scope: string;
  scope_city?: string[];
  scope_region: string;
  scope_state: string;
  source_name: string[];
  status: number;
  thematic_area: string[];
  thematic_area_display: string[];
  updated_date: string;
  descriptor?: string[];
  mh?: string[];
  relationship_active?: string[];
}
