import { Area, Country, queryType } from "@/services/types/resources";
import { CountriesRegions, CountryGroupType } from "@/data/countries";

import { FilterOption } from "./filters";
import { TagItem } from "./resourceitem";

//Usado para filtros por tag
export const initialFilters = (
  applyFilters: Function,
  setLoading: Function,
  setInitialFilterDone: Function,
  country?: string,
  thematicArea?: string,
  region?: string
) => {
  if (country) {
    applyFilters([
      {
        parameter: "country",
        query: country,
      },
    ]);
  }
  if (region) {
    applyFilters([
      {
        parameter: "region",
        query: region,
      },
    ]);
  }
  if (thematicArea) {
    applyFilters([
      {
        parameter: "descriptor",
        query: thematicArea,
      },
    ]);
  }
  setLoading(false);
  setInitialFilterDone(true);
};

export function getCountryTags(
  countryList: Country[],
  lang: string
): Array<TagItem> {
  return countryList.map((c) => {
    let item = c.countryLangs.find((cl) => cl.lang === lang)?.countryName || "";
    return { name: item, type: "country" };
  });
}
export function getRegionByCountry(countries: string[]): string[] {
  let regions = groupCountriesByRegion(CountriesRegions);
  const itemRegions = regions.filter((region) =>
    region.countries.some((country) =>
      countries
        .map((c) => c?.toLocaleLowerCase())
        .includes(country?.toLocaleLowerCase())
    )
  );
  return itemRegions.map((region) => region.region);
}
export function groupOccurrencesByRegion(
  filterOptions: FilterOption[]
): FilterOption[] {
  let regions = groupCountriesByRegion(CountriesRegions);
  return regions.map((region) => {
    // Filtrar os países que pertencem à região atual
    const countriesInRegion = region.countries;
    // Somar as ocorrências dos países que pertencem à região
    const totalOccurrences = filterOptions
      .filter((option) => countriesInRegion.includes(option.label))
      .reduce((sum, option) => sum + (option.ocorrences || 0), 0);

    const queryStrings = filterOptions
      .filter((option) => countriesInRegion.includes(option.label))
      .map((q) => q.id)
      .join(",");

    // Retornar um novo FilterOption para a região
    return {
      label: region.region,
      ocorrences: totalOccurrences,
      id: "qsCountry-" + queryStrings,
    };
  });
}
type RegionGroupType = {
  region: string;
  countries: string[];
};
function groupCountriesByRegion(
  countries: CountryGroupType[]
): RegionGroupType[] {
  return countries.reduce<RegionGroupType[]>((acc, country) => {
    // Find the existing region in the accumulator
    const region = acc.find((item) => item.region === country.Region);

    if (region) {
      // Add the country (English name) to the existing region's countries list
      region.countries.push(country.en);
      region.countries.push(country.es);
      region.countries.push(country.pt);
      region.countries.push(country.fr);
    } else {
      // Create a new region group
      acc.push({
        region: country.Region,
        countries: [country.en],
      });
    }

    return acc;
  }, []);
}
export function getTematicAreaTags(
  thematicAreaList: Area[],
  lang: string
): Array<TagItem> {
  return thematicAreaList.map((c) => {
    let item = c.areaLangs.find((cl) => cl.lang === lang)?.countryName || "";
    return { name: item, type: "area" };
  });
}
export function getDescriptorTags(descriptorList: string[]): Array<TagItem> {
  return descriptorList
    .filter((c) => c != "")
    .map((c) => {
      return { name: c, type: "descriptor" };
    });
}
