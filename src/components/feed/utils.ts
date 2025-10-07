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
  region?: string,
  mediaType?: string
) => {
  // Coleta todos os filtros em um array
  const filters: queryType[] = [];
  
  if (mediaType) {
    filters.push({
      parameter: "resource_type",
      query: mediaType,
    });
  }
  if (country) {
    filters.push({
      parameter: "country",
      query: country,
    });
  }
  if (region) {
    filters.push({
      parameter: "region",
      query: region,
    });
  }
  if (thematicArea) {
    filters.push({
      parameter: "descriptor",
      query: thematicArea,
    });
  }
  
  // Aplica todos os filtros de uma vez
  if (filters.length > 0) {
    applyFilters(filters);
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
      countries.some((searchCountry) => {
        const searchLower = searchCountry?.toLocaleLowerCase().trim();
        const countryLower = country?.toLocaleLowerCase().trim();
        
        // Correspondência exata
        if (searchLower === countryLower) return true;
        
        // Correspondência parcial mais específica - só para casos conhecidos
        if (searchLower === "united states" && countryLower.includes("united states")) return true;
        if (searchLower === "united kingdom" && countryLower.includes("united kingdom")) return true;
        if (searchLower === "korea, republic of" && (countryLower.includes("korea") || countryLower.includes("republic"))) return true;
        
        return false;
      })
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
      // Add all language variants of the country to the existing region's countries list
      region.countries.push(country.en);
      region.countries.push(country.es);
      region.countries.push(country.pt);
      region.countries.push(country.fr);
    } else {
      // Create a new region group with all language variants
      acc.push({
        region: country.Region,
        countries: [country.en, country.es, country.pt, country.fr],
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
