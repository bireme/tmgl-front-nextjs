import { Button, Flex, Input } from "@mantine/core";

import styles from "../../../styles/components/forms.module.scss";

export const SearchForm = ({ title, subtitle }: AcfSearch) => {
  return (
    <Flex className={styles.SearchForm} align={"center"}>
      <form>
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
        <Flex gap={10}>
          <Input className={styles.HeroFormInput} size={"lg"} />
          <Button className={styles.FormButton} size={"lg"}>
            Search
          </Button>
        </Flex>
        <Flex gap={20} mt={18}>
          <a>Advanced search</a>
          <a>How to search</a>
        </Flex>
      </form>
    </Flex>
  );
};
