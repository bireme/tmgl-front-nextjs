import { Button, Flex, Input } from "@mantine/core";

import { AcfSearch } from "@/services/types/homeAcf.dto";
import styles from "../../../styles/components/forms.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";

export const SearchForm = ({ title, subtitle, small }: AcfSearch) => {
  const router = useRouter();
  const [searchString, setSearchString] = useState<string | null>(null);

  const handleSearch = () => {
    try {
      if (!process.env.BASE_SEARCH_URL) {
        throw new Error("Error: BaseSearchURL not defined");
      }
      if (searchString) {
        router.push(process.env.BASE_SEARCH_URL + `/?q=${searchString}`);
      } else {
        router.push(process.env.BASE_SEARCH_URL);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex
      className={`${styles.SearchForm}`}
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
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault(); // Evita que o formulário seja submetido automaticamente
                handleSearch(); // Função para submeter o formulário
              }
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
          <a href={"https://pesquisa.bvsalud.org/tmgl/advanced/?lang=en"}>
            Advanced search
          </a>
          <a href={"https://pesquisa.bvsalud.org/tmgl/decs-locator/?lang=en"}>
            Subject Headings
          </a>
        </Flex>
      </form>
    </Flex>
  );
};
