import { FilterItem, MultLangFilter } from "./resources";

export interface LegislationServiceDto {
  data: LegislationItemDto[];
  countryFilters: MultLangFilter[];
  actTypeFilters: MultLangFilter[];
  publicationYearFilter: FilterItem[];
  totalFound: number;
}

export interface LegislationItemDto {
  act_number?: string[];
  act_type?: string; // formato multilíngue com separador "^" e "|"
  title: string;
  act_scope: string;
  organ_issuer: string[];
  language: string[];
  unofficial_ementa: string;
  file: string;
  collection: string;
  indexed_in: string;
  descriptor: string[];
  django_id: string;
  fulltext: string[]; // formato: lang|url
  id: string;
  indexed_database: string[];
  issuer_organ: string[]; // multilíngue
  official_ementa: string[];
  publication_date: Date; // formato YYYY-MM-DD
  scope: string; // multilíngue
  scope_region: string; // multilíngue
  source_name: string[]; // multilíngue
  status: number;
  thematic_area: string[];
  thematic_area_display: string[]; // multilíngue
  updated_date: Date; // formato YYYYMMDD
}
