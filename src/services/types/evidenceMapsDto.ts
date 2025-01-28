import { Area, Country, FilterItem, MultLangFilter } from "./resources";

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
}
