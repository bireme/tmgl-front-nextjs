import { Button, Flex, Input } from "@mantine/core";

import styles from "../../../styles/components/forms.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";

export const SearchForm = ({ title, subtitle }: AcfSearch) => {
  const router = useRouter();
  const [searchString, setSearchString] = useState<string | null>(null);

  const handleSearch = () => {
    try {
      if (!process.env.BASE_SEARCH_URL) {
        throw new Error("Error: BaseSearchURL not defined");
      }
      if (searchString) {
        router.push(process.env.BASE_SEARCH_URL + `/?q=${searchString}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      className={styles.SearchForm}
      py={{ base: 40, md: 0 }}
      align={{ base: "flex-end", md: "center" }}
    >
      <form>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
        <Flex gap={10}>
          <Input
            className={styles.HeroFormInput}
            size={"lg"}
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            value={searchString ? searchString : ""}
          />
          <Button
            onClick={() => {
              handleSearch();
            }}
            className={styles.FormButton}
            size={"lg"}
          >
            Search
          </Button>
        </Flex>
        <Flex gap={20} mt={18}>
          <a
            href={
              "https://pesquisa.bvsalud.org/tmgl/decs-locator/?lang=en&mode=&tree_id=MT"
            }
          >
            Advanced search
          </a>
          <a href={"https://pesquisa.bvsalud.org/tmgl/advanced/?lang=en"}>
            How to search
          </a>
        </Flex>
      </form>
    </Flex>
  );
};
