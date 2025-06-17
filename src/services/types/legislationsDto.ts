import { FilterItem, MultLangFilter } from "./resources";

export interface LegislationServiceDto {
  data: LegislationItemDto[];
  languageFilters: MultLangFilter[];
  countryFilters: MultLangFilter[];
  thematicAreaFilters: FilterItem[];
  totalFound: number;
}

export interface LegislationItemDto {
  _version_?: number;
  act_number?: string[];
  act_type?: string; // formato multilíngue com separador "^" e "|"
  created_date: string; // formato YYYYMMDD
  descriptor: string[];
  django_ct: string;
  django_id: string;
  fulltext: string[]; // formato: lang|url
  id: string;
  indexed_database: string[];
  issuer_organ: string[]; // multilíngue
  language: string[]; // multilíngue
  mh: string[];
  official_ementa: string[];
  publication_date: string; // formato YYYY-MM-DD
  scope: string; // multilíngue
  scope_region: string; // multilíngue
  source_name: string[]; // multilíngue
  status: number;
  thematic_area: string[];
  thematic_area_display: string[]; // multilíngue
  title: string;
  unofficial_ementa: string[];
  updated_date: string; // formato YYYYMMDD
}
