export interface Country {
  countryLangs: Array<CountryData>;
}

export interface Area {
  areaLangs: Array<CountryData>;
}

export interface AereaData {
  lang: string;
  areaTitle: string;
}

export interface CountryData {
  lang: string;
  countryName: string;
}

export interface FilterItem {
  type: string;
  count: number;
}

export interface MultLangFilter {
  lang: string;
  count: number;
  type: string;
  queryString?: string;
}

export interface MultLangStringAttr {
  lang: string;
  content: string;
}

export interface queryType {
  parameter: string;
  query: string;
}
