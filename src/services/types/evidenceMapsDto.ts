import { Area, Country, FilterItem, MultLangFilter } from "./resources";

export interface EvidenceMapApiDto {
  data: EvidenceMapApiResponseDto;
}
export interface EvidenceMapApiResponseDto {
  abstract: string;
  author: string;
  collections: string[];
  cooperative_center_code: string;
  created_time: string;
  descriptors: DescriptorApiDto[];
  id: number;
  link: string[];
  objective: string;
  originator: string;
  publication_country: string[];
  source_languages: string[];
  source_types: string[];
  status: number;
  thematic_areas: ThematicAreaApiDto[];
  time_period_textual: string;
  title: string;
  updated_time: string;
}

export interface DescriptorApiDto {
  code: string;
  text: string;
}

export interface ThematicAreaApiDto {
  code: string;
  text: string;
}
export interface EvidenceMapsServiceDto {
  data: EvidenceMapItemDto[];
  languageFilters: MultLangFilter[];
  countryFilters: MultLangFilter[];
  thematicAreaFilters: FilterItem[];

  totalFound: number;
}

export interface EvidenceMapItemDto {
  id: string;
  title: string;
  excerpt: string;
  links?: string[];
  created_at: Date;
  updated_at: Date;
  countries?: Country[];
  areas?: Area[];
  descriptors?: string[];
  image?: string;
  releatedDocuments?: releatedDocument[];
}

export interface releatedDocument {
  label: string;
  content: string;
}
