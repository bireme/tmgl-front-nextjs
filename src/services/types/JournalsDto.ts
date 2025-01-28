import { Country, FilterItem, MultLangFilter } from "./resources";

export interface JournalServiceDto {
  data: JournalItemDto[];
  languageFilters: MultLangFilter[];
  countryFilters: MultLangFilter[];
  thematicAreaFilters: FilterItem[];
}

export interface JournalItemDto {
  id: string;
  title: string;
  excerpt: string;
  links?: string[];
  created_at: Date;
  updated_at: Date;
  countries?: Country[];
}
