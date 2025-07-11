import { MultLangStringAttr } from "./resources";

export interface RegulationsAndPolicesDto {
  data: RegulationAndPolicesItemDto[];
  totalFound: number;
}

export interface RegulationAndPolicesItemDto {
  id: string;
  django_id: string;
  language: MultLangStringAttr[];
  unofficial_ementa: MultLangStringAttr[];
  file: string;
  organ_issuer: string[];
  act_scope: string;
  title: string;
  act_type?: string;
  act_number?: string[];
  act_country?: MultLangStringAttr[];
  publication_date: Date;
  official_ementa: MultLangStringAttr[];
  collection?: string;
  indexed_in?: string;
  type?: string; // "legislation" ou "bibliographic"
}
