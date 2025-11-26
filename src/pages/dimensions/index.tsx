import { Center, Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { DimensionsFeed } from "@/components/feed/dimensions";
import { DimensionsSection } from "@/components/sections";
import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import { ImageSection } from "@/components/video";
import styles from "../../styles/pages/home.module.scss";
import { capitalizeFirstLetter } from "@/helpers/stringhelper";

export default function Dimensions() {
  const { globalConfig } = useContext(GlobalContext);
  const [displayType, setDisplayType] = useState<string>("column");

  return (
    <>
      <Head>
        <title>Traditional Medicine Dimensions - The WHO Traditional Medicine Global Library</title>
      </Head>
      {/* <BreadCrumbs
          blackColor
          path={[
            { path: "/", name: "HOME" },
            { path: "/dimensions", name: "Dimensions" },
          ]}
        />
        <Flex
          mb={100}
          justify={"space-between"}
          align={"center"}
          px={15}
          mt={30}
        >
          <h3 className={styles.TitleWithIcon} style={{ margin: "5px" }}>
            {capitalizeFirstLetter("DIMENSIONS")}
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

        <DimensionsFeed displayType={displayType} /> */}
      <ImageSection>
        <Container size={"xl"} py={"5%"} className={styles.TraditionalMedicine}>
          <h2>
            Traditional Medicine Dimensions
          </h2>
          <Center m={0} p={0}>
            <h3>
              The Traditional Medicine Dimensions, derived from the Gujarat
              Declaration, form the core pillars of TMGL. Advancing these
              dimensions contributes to achieving health and well-being for all.
            </h3>
          </Center>

          <DimensionsSection />
        </Container>
      </ImageSection>
    </>
  );
}
