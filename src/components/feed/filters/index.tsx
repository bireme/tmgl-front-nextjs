import { Accordion, Button, Checkbox, Flex, Input } from "@mantine/core";
import { useEffect, useState } from "react";

import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";

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
  stringParameter?: string; //Parametro para busca aberta (muda em determinadas api's)
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

  /**
   * Handles changes in the state of a checkbox, updating the selectedFilters state
   * accordingly.
   *
   * @param {string} filterLabel - The label of the filter group
   * @param {string} itemLabel - The label of the item
   * @param {boolean} checked - Whether the checkbox is checked
   * @param {string} [itemId] - Optional ID of the item
   */
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

  /**
   * Submits the filters to the callback function, converting the state into a array of queryType
   * @returns {void}
   */
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

  return (
    <div className={styles.FilterContent}>
      <h3>Filters</h3>
      <Input.Label>Search</Input.Label>
      <Input
        placeholder="Search for something"
        radius={"sm"}
        value={queryString}
        onChange={(e) => setQueryString(e.target.value)}
      />

      {filters?.map((f, k) => {
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
                            ? selectedFilters[f.queryType]?.includes(item.id) ||
                              false
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
                      {/* {item.ocorrences ? (
                        <span>({item.ocorrences})</span>
                      ) : item.ocorrences == 0 ? (
                        <span>({item.ocorrences})</span>
                      ) : (
                        <></>
                      )} */}
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
        onClick={() => {
          submit();
        }}
      >
        Apply
      </Button>
    </div>
  );
};
