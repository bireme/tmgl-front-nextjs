import { Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import { ThematicPagesFeed } from "@/components/feed/thematicpages";
import styles from "../../styles/pages/home.module.scss";
import { capitalizeFirstLetter } from "@/helpers/stringhelper";

export default function News() {
  const { globalConfig } = useContext(GlobalContext);
  const [displayType, setDisplayType] = useState<string>("column");

  return (
    <>
      <Head>
        <title>Thematic Pages - The WHO Traditional Medicine Global Library</title>
      </Head>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          blackColor
          path={[
            { path: "/", name: "HOME" },
            { path: "/thematic-pages", name: "Thematic Pages" },
          ]}
        />
        <Flex justify={"space-between"} align={"center"} px={15} mt={30}>
          <h3 className={styles.TitleWithIcon} style={{ margin: "5px" }}>
            {capitalizeFirstLetter("Thematic  pages")}
          </h3>

          <div>
            <IconLayoutGrid
              size={30}
              onClick={() => setDisplayType("column")}
              style={{ cursor: "pointer" }}
              color={displayType == "column" ? "black" : "silver"}
            />
            <IconLayoutList
              size={30}
              onClick={() => setDisplayType("list")}
              style={{ cursor: "pointer" }}
              color={displayType != "column" ? "black" : "silver"}
            />
          </div>
        </Flex>
        <Flex px={15} mb={40}>
          <p className={styles.DescriptionThin}>
            {globalConfig?.acf.thematic_area_description}
          </p>
        </Flex>
        <ThematicPagesFeed displayType={displayType} />
      </Container>
    </>
  );
}
