import { FilterItem } from "./resources";

export interface GlobalSummitDto {
  data: GlobalSummitItemDto[];
  eventFilter: FilterItem[];
  regionFilter: FilterItem[];
  countryFilter: FilterItem[];
  thematicAreaFilter: FilterItem[];
  documentTypeFilter: FilterItem[];
  yearFilter: FilterItem[];
  totalFound: number;
}

export interface GlobalSummitItemDto {
  id: string;
  link: string;
  title: string;
  excerpt: string;
  country?: string;
  region?: string;
  thematicArea?: string[];
  documentType?: string;
  year?: string;
}
