import {
  Area,
  Country,
  MultLangFilter,
  MultLangStringAttr,
} from "../types/resources";

import { JournalDescription } from "../types/JournalsDto";
import { LisDocuments } from "../types/repositoryTypes";
import { ThematicAreaApiDto } from "../types/evidenceMapsDto";

export const findDescription = (
  descriptions: JournalDescription[],
  searchLang: string
) => {
  const description = descriptions.find((e) => e._i == searchLang)?.text;
  return description ? description : "";
};
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

export function parseCountriesByAttr(item: string[]): Country[] {
  let countries: Country[] = [];
  item?.forEach((country) => {
    let countryLangs = parseCountry(country);
    countries.push(countryLangs);
  });
  return countries;
}
export function parseMultLangStringAttr(
  items: Array<String>
): MultLangStringAttr[] {
  let langItems: MultLangStringAttr[] = [];
  langItems = items.map((i) => {
    let attrs = i.split("|");
    return {
      lang: attrs[0],
      content: attrs[1],
    };
  });
  return langItems;
}
export function parseJournalCountries(item: LisDocuments): Country[] {
  let countries: Country[] = [];
  if (item.country) {
    let countryLangs = parseCountry(item.country);
    countries.push(countryLangs);
  }

  return countries;
}

export function parseTematicAreas(item: LisDocuments): Area[] {
  let areas: Area[] = [];
  item.thematic_area_display?.forEach((desc) => {
    let areaLangs = parseTematicArea(desc);
    areas.push(areaLangs);
  });
  return areas;
}

export function parseThematicAreabyAttr(item: ThematicAreaApiDto[]): Area[] {
  let areas: Area[] = [];
  item?.forEach((desc) => {
    let areaLangs = {
      areaLangs: [
        {
          lang: "pt",
          countryName: desc.text,
        },
      ],
    };
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
            queryString: items[i][0],
          });
        }
      });
    }
  }
  return filters;
}
