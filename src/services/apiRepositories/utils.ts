import { Area, Country, MultLangFilter } from "../types/resources";
import {
  FacetField,
  FacetFields,
  LisDocuments,
} from "../types/RepositoryTypes";

export function parseCountry(item: string): Country {
  let items = item.split("|");
  let countryLangs: Country = {
    countryLangs: [],
  };
  let langs = items.map((countryItem) => {
    let itemCountry = countryItem.split("^");
    return {
      lang: itemCountry[0],
      countryName: itemCountry[1],
    };
  });
  countryLangs.countryLangs = langs;
  return countryLangs;
}

export function parseCountries(item: LisDocuments): Country[] {
  let countries: Country[] = [];
  item.publication_country?.forEach((country) => {
    let countryLangs = parseCountry(country);
    countries.push(countryLangs);
  });
  return countries;
}

export function parseTematicAreas(item: LisDocuments): Area[] {
  let areas: Area[] = [];
  item.thematic_area_display?.forEach((country) => {
    let areaLangs = parseTematicArea(country);
    areas.push(areaLangs);
  });
  return areas;
}

export function parseTematicArea(item: string): Area {
  let items = item.split("|");
  let areas: Area = {
    areaLangs: [],
  };
  let langs = items.map((countryItem) => {
    let itemCountry = countryItem.split("^");
    return {
      lang: itemCountry[0],
      countryName: itemCountry[1],
    };
  });
  areas.areaLangs = langs;
  return areas;
}

export function parseMultLangFilter(items: Array<String>): MultLangFilter[] {
  let filters: MultLangFilter[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i][0]) {
      let langs = items[i][0].split("|");
      langs.forEach((lang) => {
        if (lang) {
          filters.push({
            lang: lang.split("^")[0],
            count: parseInt(items[i][1]),
            type: lang.split("^")[1],
          });
        }
      });
    }
  }
  return filters;
}
