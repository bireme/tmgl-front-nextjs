import { Button, Flex, Input } from "@mantine/core";

import styles from "../../../styles/components/forms.module.scss";

export const SearchForm = () => {
  return (
    <Flex className={styles.SearchForm} align={"center"}>
      <form>
        <h2>
          Discover a comprehensive <br /> resource for traditional medicine.
        </h2>
        <h3>
          Access a wealth of scientific and technical information, regional
          insights, and <br /> global strategies.
        </h3>
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
