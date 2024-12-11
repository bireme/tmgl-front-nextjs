import {
  Accordion,
  Button,
  Checkbox,
  Flex,
  Input,
  Stack,
  stylesToString,
} from "@mantine/core";

import { queryType } from "@/services/lis/LisService";
import styles from "../../../styles/components/resources.module.scss";
import { useState } from "react";

export interface FilterOption {
  label: string;
  ocorrences: number;
}
export interface LisFiltersFormProps {
  callBack: (q?: queryType[]) => {};
  contentThemeList?: FilterOption[];
}
export const LisFilters = ({
  callBack,
  contentThemeList,
}: LisFiltersFormProps) => {
  const [queryString, setQueryString] = useState<string>("");
  const [checkedContentTheme, setCheckedContenTheme] = useState<string[]>([]);
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

      <Accordion mt={30} chevronPosition="left" radius={"md"} defaultValue="1">
        <Accordion.Item
          className={styles.filterGroupItem}
          value={"content-type"}
          key={"content-type"}
        >
          <Accordion.Control mb={10}>Theme</Accordion.Control>
          <Accordion.Panel>
            {contentThemeList &&
              contentThemeList.map((item: FilterOption, k) => (
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
                    checked={checkedContentTheme.includes(item.label)}
                    label={item.label}
                    key={k}
                    onChange={(event) => {
                      const isChecked = event.currentTarget.checked;
                      if (isChecked) {
                        setCheckedContenTheme((prev) => [...prev, item.label]);
                      } else {
                        setCheckedContenTheme((prev) =>
                          prev.filter((i) => i !== item.label)
                        );
                      }
                    }}
                  />
                  <span>({item.ocorrences})</span>
                </Flex>
              ))}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Button
        mt={20}
        fullWidth
        onClick={() => {
          let queryItems: queryType[] = [];
          if (queryString && queryString !== "") {
            queryItems.push({
              parameter: "title",
              query: queryString,
            });
          }
          if (checkedContentTheme && checkedContentTheme?.length > 0) {
            checkedContentTheme.map((item: string) => {
              queryItems.push({
                parameter: "descriptor",
                query: item,
              });
            });
          }
          callBack(queryItems ? queryItems : undefined);
        }}
      >
        Apply Filters
      </Button>
    </div>
  );
};
