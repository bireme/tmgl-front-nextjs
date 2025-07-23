import { FilterItem } from "./resources";

export interface DefaultResourceDto {
  data: DefaultResourceItemDto[];
  regionFilter: FilterItem[];
  countryFilter: FilterItem[];
  thematicAreaFilter: FilterItem[];
  documentTypeFilter: FilterItem[];
  yearFilter: FilterItem[];
  modalityFilter?: FilterItem[];
  eventFilter?: FilterItem[];
  totalFound: number;
}

export interface DefaultResourceItemDto {
  id: string;
  link: string;
  title: string;
  excerpt: string;
  country?: string;
  region?: string;
  thematicArea?: string[];
  documentType?: string;
  year?: string;
  modality?: string;
}
