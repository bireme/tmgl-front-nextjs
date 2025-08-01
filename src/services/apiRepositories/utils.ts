import {
  Area,
  Country,
  FilterItem,
  MultLangFilter,
  MultLangStringAttr,
  queryType,
} from "../types/resources";

import { DefaultResourceItemDto } from "../types/defaultResource";
import { JournalDescription } from "../types/journalsDto";
import { LisDocuments } from "../types/repositoryTypes";
import { ThematicAreaApiDto } from "../types/evidenceMapsDto";

export function applyDefaultResourceFilters(
  queryItems: queryType[],
  orderedData: DefaultResourceItemDto[]
): DefaultResourceItemDto[] {
  const stringParameter = queryItems.filter((q) => q.parameter === "title");
  const resourceTypeFilter = queryItems
    .filter((q) => q.parameter === "resource_type")
    .map((q) => q.query);
  const modalityFilter = queryItems
    .filter((q) => q.parameter === "resource_type")
    .map((q) => q.query);
  const yearFilters = queryItems
    .filter((q) => q.parameter === "year")
    .map((q) => q.query);
  const documentFilters = queryItems
    .filter((q) => q.parameter === "document_type")
    .map((q) => q.query);
  const thematicAreaFilters = queryItems
    .filter((q) => q.parameter === "thematic_area")
    .map((q) => q.query);
  const countryFilters = queryItems
    .filter((q) => q.parameter === "country")
    .map((q) => q.query);
  const regionFilters = queryItems
    .filter((q) => q.parameter === "region")
    .map((q) => q.query);

  if (regionFilters.length) {
    orderedData = orderedData.filter((item) =>
      regionFilters
        .map((c) => c.trim().toLocaleLowerCase())
        .includes(item.region?.trim().toLocaleLowerCase() ?? "")
    );
  }

  if (countryFilters.length) {
    orderedData = orderedData.filter((item) =>
      countryFilters
        .map((c) => c.trim().toLocaleLowerCase())
        .includes(item.country?.trim().toLocaleLowerCase() ?? "")
    );
  }

  if (modalityFilter.length) {
    orderedData = orderedData.filter((item) =>
      modalityFilter.includes(
        item.modality?.trim().toLocaleLowerCase()
          ? item.modality?.trim().toLocaleLowerCase()
          : ""
      )
    );
  }

  if (resourceTypeFilter.length) {
    orderedData = orderedData.filter((item) =>
      modalityFilter.includes(
        item.documentType?.trim().toLocaleLowerCase()
          ? item.documentType?.trim().toLocaleLowerCase()
          : ""
      )
    );
  }

  if (stringParameter.length > 0) {
    orderedData = orderedData.filter(
      (item) =>
        item.title
          .toLowerCase()
          ?.trim()
          .includes(stringParameter[0].query.toLowerCase()) ||
        item.excerpt
          .toLowerCase()
          ?.trim()
          .includes(stringParameter[0].query.toLowerCase())
    );
  }

  if (yearFilters.length) {
    orderedData = orderedData.filter((item) =>
      yearFilters.includes(item.year?.trim() ? item.year?.trim() : "")
    );
  }
  if (countryFilters.length) {
    orderedData = orderedData.filter((item) =>
      countryFilters
        .map((c) => c.trim().toLocaleLowerCase())
        .includes(item.country?.trim().toLocaleLowerCase() ?? "")
    );
  }
  if (documentFilters.length) {
    orderedData = orderedData.filter((item) =>
      documentFilters.includes(
        item.documentType?.trim().toLocaleLowerCase()
          ? item.documentType?.trim().toLocaleLowerCase()
          : ""
      )
    );
  }
  if (thematicAreaFilters.length) {
    orderedData = orderedData.filter((item) =>
      Array.isArray(item.thematicArea)
        ? item.thematicArea.some((ta) => thematicAreaFilters.includes(ta))
        : thematicAreaFilters.includes(item.thematicArea || "")
    );
  }

  return orderedData;
}

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
    if (attrs.length < 2) {
      return { lang: "", content: i.toString() };
    }
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
export function mergeFilterItems(...filters: FilterItem[][]): FilterItem[] {
  const map = new Map<string, number>();

  for (const group of filters) {
    for (const item of group) {
      const current = map.get(item.type) || 0;
      map.set(item.type, current + item.count);
    }
  }

  return Array.from(map.entries()).map(([type, count]) => ({
    type,
    count,
  }));
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

export const mapToFilterItems = (items: LisDocuments[]): FilterItem[] => {
  const countMap: Record<string, number> = {};

  items.forEach((item) => {
    item.event_modality.forEach((modality) => {
      countMap[modality] = (countMap[modality] || 0) + 1;
    });
  });

  return Object.entries(countMap).map(([type, count]) => ({ type, count }));
};

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

export function mergeMultLangFilters(
  ...filters: MultLangFilter[][]
): MultLangFilter[] {
  const seen = new Set<string>();
  const merged: MultLangFilter[] = [];

  for (const group of filters) {
    for (const item of group) {
      const key = `${item.lang}|${item.queryString}|${item.type}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(item);
      }
    }
  }
  return merged;
}

export function mapBibliographicTypes(type: string): string {
  switch (type.toLowerCase()) {
    case "s":
      return "Article";
    case "n":
      return "Non-conventional";
    case "m":
      return "Monography";
    case "t":
      return "Thesis";
    case "p":
      return "Project Document";
    case "sc":
      return "Congress and conference";
    case "scp":
      return "Congress and conference";
    case "msc":
      return "Congress and conference";
    case "nc":
      return "Congress and conference";
    case "mc":
      return "Congress and conference";
    case "mcp":
      return "Congress and conference";
  }
  return "Bibliographic";
}

export function mapJoinedMultLangArrayToFilterItem(
  data: [string, number][],
  language: string
): FilterItem[] {
  const result: FilterItem[] = [];

  for (const [multiLangStr, count] of data) {
    const entries = multiLangStr.split("|");

    for (const entry of entries) {
      const [lang, value] = entry.split("^");

      if (lang && value) {
        if (lang == language) {
          result.push({
            count,
            type: value,
          });
        }
      }
    }
  }

  return result;
}

export function mapJoinedMultLangArray(
  data: [string, number][],
  queryString: string
): MultLangFilter[] {
  const result: MultLangFilter[] = [];

  for (const [multiLangStr, count] of data) {
    const entries = multiLangStr.split("|");

    for (const entry of entries) {
      const [lang, value] = entry.split("^");

      if (lang && value) {
        result.push({
          lang,
          count,
          type: value,
          queryString: queryString,
        });
      }
    }
  }

  return result;
}
