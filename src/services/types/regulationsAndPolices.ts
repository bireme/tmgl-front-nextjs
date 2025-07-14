import { MultLangStringAttr } from "./resources";

export interface RegulationsAndPolicesDto {
  data: RegulationAndPolicesItemDto[];
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
  type: string;
  country?: MultLangStringAttr[];
  publication_date: Date;
  resource_type?: string;
}
