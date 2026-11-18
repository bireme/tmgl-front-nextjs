import { Button, Flex, Input } from "@mantine/core";

import { AcfSearch } from "@/services/types/homeAcf.dto";
import styles from "../../../styles/components/forms.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";
import { searchUrl } from "@/helpers/search";

export const SearchForm = ({ title, subtitle, small }: AcfSearch) => {
  const router = useRouter();
  const [searchString, setSearchString] = useState<string | null>(null);

  const [error, setError] = useState("");
  const handleSearch = async () => {
    setError("");
    try {
      await router.push(searchUrl(process.env.BASE_SEARCH_URL, searchString || ""));
    } catch {
      setError("Search is temporarily unavailable. Please try again later.");
    }
  };

  return (
    <Flex
      className={`${styles.SearchForm} ${small ? styles.small : ""}`}
      py={{ base: small ? 120 : 40, md: 0 }}
      align={{ base: "flex-end", md: "center" }}
    >
      <form onSubmit={(event) => { event.preventDefault(); void handleSearch(); }}>
        <h1>{title}</h1>
        <h3>{subtitle}</h3>
        <Flex gap={10}>
          <Input
            className={styles.HeroFormInput}
            size={"md"}
            aria-label="Search"
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
            value={searchString ? searchString : ""}
          />
          <Button
            type="submit"
            className={styles.FormButton}
            size={"md"}
          >
            Search
          </Button>
        </Flex>
        {error && <p role="alert">{error}</p>}
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
