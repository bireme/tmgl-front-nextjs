import { Accordion, Button, Checkbox, Flex, Input } from "@mantine/core";
import { useEffect, useState } from "react";

import { DefaultResourceDto } from "@/services/types/defaultResource";
import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";

// Função para remover itens duplicados baseados no label e filtrar labels em branco
const removeDuplicateItems = (items: FilterOption[]): FilterOption[] => {
  const seen = new Set<string>();
  return items.filter((item) => {
    // Remove itens com label vazio, nulo ou apenas espaços em branco
    if (!item.label || item.label.trim() === '') {
      return false;
    }
    
    // Remove itens duplicados baseados no label
    if (seen.has(item.label)) {
      return false;
    }
    
    seen.add(item.label);
    return true;
  });
};

export const DefaultFeedFilterComponent = ({
  applyFilters,
  apiResponse,
}: {
  applyFilters: (q?: queryType[] | undefined) => {};
  apiResponse: DefaultResourceDto;
}) => {
  return (
    <ResourceFilters
      callBack={applyFilters}
      filters={[
        {
          queryType: "Region",
          label: "WHO Regions",
          items: removeDuplicateItems(
            apiResponse?.regionFilter.map((c) => ({
              label: c.type,
              ocorrences: c.count,
              id: undefined,
            })) || []
          ),
        },
        {
          queryType: "country",
          label: "Country",
          items: removeDuplicateItems(
            apiResponse?.countryFilter.map((c) => ({
              label: c.type,
              ocorrences: c.count,
              id: undefined,
            })) || []
          ),
        },
        {
          queryType: "descriptor",
          label: "Thematic area",
          items: removeDuplicateItems(
            apiResponse?.thematicAreaFilter.map((c) => ({
              label: c.type,
              ocorrences: c.count,
              id: undefined,
            })) || []
          ),
        },
        {
          queryType: "year",
          label: "Year",
          items: removeDuplicateItems(
            Array.from(
              new Map(
                apiResponse?.yearFilter.map((c) => [
                  c.type, // chave de unicidade
                  {
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
                  },
                ])
              ).values()
            ) || []
          ),
        },
        {
          queryType: "resource_type",
          label: "Media Type",
          items: removeDuplicateItems(
            apiResponse.resourceTypeFilter
              ? apiResponse?.resourceTypeFilter.map((c) => ({
                  label: c.type,
                  ocorrences: c.count,
                  id: undefined,
                }))
              : []
          ),
        },
      ]}
    />
  );
};

export interface FilterType {
  label: string;
  queryType: string;
  items: FilterOption[];
}
export interface FilterOption {
  label: string;
  ocorrences?: number;
  id?: string;
}
export interface FiltersFormProps {
  callBack: (q?: queryType[]) => {};
  filters?: FilterType[];
  stringParameter?: string;
}
export const ResourceFilters = ({
  callBack,
  filters,
  stringParameter,
}: FiltersFormProps) => {
  stringParameter = stringParameter ? stringParameter : "title";
  const [queryString, setQueryString] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  const handleCheckboxChange = (
    filterLabel: string,
    itemLabel: string,
    checked: boolean,
    itemId?: string
  ) => {
    if (itemId) {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterLabel]: checked
          ? [...(prev[filterLabel] || []), itemId]
          : (prev[filterLabel] || []).filter((item) => item !== itemId),
      }));
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterLabel]: checked
          ? [...(prev[filterLabel] || []), itemLabel]
          : (prev[filterLabel] || []).filter((item) => item !== itemLabel),
      }));
    }
  };

  const submit = () => {
    let queryItems: queryType[] = [];

    if (queryString) {
      queryItems.push({ parameter: stringParameter, query: queryString });
    }

    Object.entries(selectedFilters).forEach(([filterLabel, items]) => {
      items.forEach((item) => {
        if (!item.includes("qsCountry"))
          queryItems.push({ parameter: filterLabel, query: item });
        else {
          let qsCountries = item.replace("qsCountry-", "").split(",");
          qsCountries.forEach((q) => {
            queryItems.push({ parameter: filterLabel, query: q });
          });
        }
      });
    });
    callBack(queryItems.length > 0 ? queryItems : undefined);
  };

  const clearFilters = () => {
    setQueryString("");
    setSelectedFilters({});
    callBack(undefined);
  };

  return (
    <div className={styles.FilterContent}>
      <h3>Filters</h3>
      <Input.Label>Search</Input.Label>
      <Input
        placeholder="Search for something"
        radius={"sm"}
        value={queryString}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submit();
          }
        }}
        onChange={(e) => setQueryString(e.target.value)}
      />

      {filters
        ?.filter((f) => f.items.length > 0)
        .map((f, k) => {
          return (
            <Accordion
              key={k}
              mt={30}
              chevronPosition="left"
              radius={"md"}
              defaultValue="1"
            >
              <Accordion.Item
                className={styles.filterGroupItem}
                value={"content-type"}
                key={"content-type"}
              >
                <Accordion.Control mb={10}>{f.label}</Accordion.Control>
                <Accordion.Panel>
                  {f.items &&
                    f.items.map((item: FilterOption, k) => (
                      <Flex
                        mt={7}
                        align={"center"}
                        key={k}
                        justify={"space-between"}
                        className={styles.filterCheckbox}
                      >
                        <Checkbox
                          radius={"xs"}
                          size="xs"
                          checked={
                            item.id
                              ? selectedFilters[f.queryType]?.includes(
                                  item.id
                                ) || false
                              : selectedFilters[f.queryType]?.includes(
                                  item.label
                                ) || false
                          }
                          value={item.id ? item.id : item.label}
                          label={item.label}
                          onChange={(event) =>
                            handleCheckboxChange(
                              f.queryType,
                              item.label,
                              event.currentTarget.checked,
                              item.id
                            )
                          }
                          key={k}
                        />
                      </Flex>
                    ))}
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          );
        })}
      <Button
        mt={20}
        fullWidth
        variant="outline"
        onClick={() => {
          clearFilters();
        }}
      >
        Clear Filters
      </Button>
      <Button
        mt={20}
        fullWidth
        onClick={() => {
          submit();
        }}
      >
        Apply
      </Button>
    </div>
  );
};
