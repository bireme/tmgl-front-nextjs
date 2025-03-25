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
  indexFilters: FilterItem[];
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
  onlineResource?: ApiOnlineResource[];
  responsibility_mention?: string;
  description?: MultLangStringAttr[];
  issn?: string;
  language?: MultLangStringAttr[];
  coverage?: string;
  indexedBy?: string;
}

export interface JournalApiDto {
  data: JournalsApiResponseDto;
}

export interface ApiOnlineResource {
  a: string;
  b: string;
  e: string;
  z: string;
}

export interface JournalsApiResponseDto {
  MFN: number;
  abstract_language: string[];
  acquisition_form: string;
  acquisition_priority: string;
  bireme_notes: string;
  city: string;
  classification: string;
  coden: string;
  comercial_editor: string;
  cooperative_center_code: string;
  country: string[];
  created_time: string;
  creation_date: string;
  description: JournalDescription[];
  descriptors: string[];
  editor_cc_code: string;
  final_date: string;
  final_number: string;
  final_volume: string;
  frequency: string;
  id: number;
  id_number: string;
  indexer_cc_code: string;
  initial_date: string;
  initial_number: string;
  initial_volume: string;
  issn: string;
  last_change_date: string;
  lilacs_index_year: string;
  local_code: string;
  medline_code: string;
  medline_shortened_title: string;
  national_code: string;
  notes: string;
  online: string[];
  online_notes: string[];
  publication_level: string;
  record_type: string;
  related_systems: string;
  resource_uri: string;
  responsibility_mention: string;
  secs_number: string;
  section: string;
  section_title: string;
  shortened_title: string;
  state: string;
  status: string;
  subtitle: string;
  text_language: string[];
  thematic_area: string;
  title: string;
  title_alphabet: string;
  treatment_level: string;
  updated_time: string;
  users: any[];
}

export interface JournalDescription {
  _i: string;
  text: string;
}
