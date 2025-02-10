import {
  Country,
  FilterItem,
  MultLangFilter,
  MultLangStringAttr,
} from "./resources";

export interface JournalServiceDto {
  data: JournalItemDto[];
  languageFilters: MultLangFilter[];
  countryFilters: MultLangFilter[];
  totalFound: number;
  thematicAreaFilters: FilterItem[];
}

export interface JournalItemDto {
  id: string;
  title: string;
  excerpt: string;
  links?: string[];
  created_at: Date;
  updated_at: Date;
  logo?: string;
  countries?: Country[];
  descriptors?: string[];
  description?: MultLangStringAttr[];
}
