export interface RegulationsAndPolicesDto {
  data: RegulationAndPolicesItemDto[];
  totalFound: number;
}

export interface RegulationAndPolicesItemDto {
  id: string;
  django_id: string;
  language: string[];
  unofficial_ementa: string;
  file: string;
  organ_issuer: string[];
  act_scope: string;
  title: string;
  act_type?: string;
  act_number?: string[];
  act_country?: string;
  publication_date: Date;
  official_ementa: string;
  collection?: string;
  indexed_in?: string;
}
