import { FilterItem, MultLangFilter, MultLangStringAttr } from "./resources";

export interface RegulationsAndPolicesDto {
  data: RegulationAndPolicesItemDto[];
  legislationFilters: {
    country: FilterItem[];
    type: FilterItem[];
    year: FilterItem[];
  };
  totalFound: number;
}

export interface RegulationAndPolicesItemDto {
  id: string;
  django_id: string;
  language: MultLangStringAttr[];
  description: MultLangStringAttr[];
  external_link: string;
  author: string[];
  title: string;
  type: MultLangStringAttr[];
  country?: MultLangStringAttr[];
  publication_date: Date;
  resource_type?: string;
}
