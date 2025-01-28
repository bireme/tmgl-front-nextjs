import { Accordion, Button, Checkbox, Flex, Input } from "@mantine/core";

import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";
import { useState } from "react";

export interface FilterType {
  label: string;
  queryType: string;
  items: FilterOption[];
}
export interface FilterOption {
  label: string;
  ocorrences: number;
}
export interface FiltersFormProps {
  callBack: (q?: queryType[]) => {};
  filters?: FilterType[];
}
export const ResourceFilters = ({ callBack, filters }: FiltersFormProps) => {
  const [queryString, setQueryString] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});

  const handleCheckboxChange = (
    filterLabel: string,
    itemLabel: string,
    checked: boolean
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterLabel]: checked
        ? [...(prev[filterLabel] || []), itemLabel]
        : (prev[filterLabel] || []).filter((item) => item !== itemLabel),
    }));
  };

  const submit = () => {
    let queryItems: queryType[] = [];

    if (queryString) {
      queryItems.push({ parameter: "title", query: queryString });
    }

    Object.entries(selectedFilters).forEach(([filterLabel, items]) => {
      items.forEach((item) => {
        queryItems.push({ parameter: filterLabel, query: item });
      });
    });
    console.log(queryItems);
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
                          selectedFilters[f.queryType]?.includes(item.label) ||
                          false
                        }
                        label={item.label}
                        onChange={(event) =>
                          handleCheckboxChange(
                            f.queryType,
                            item.label,
                            event.currentTarget.checked
                          )
                        }
                        key={k}
                      />
                      <span>({item.ocorrences})</span>
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
        Apply Filters
      </Button>
    </div>
  );
};
