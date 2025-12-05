import { Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { EventsFeed } from "@/components/feed/events";
import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";
import { capitalizeFirstLetter } from "@/helpers/stringhelper";

export default function Events() {
  const { globalConfig } = useContext(GlobalContext);
  const [displayType, setDisplayType] = useState<string>("column");
  const router = useRouter();
  const { country, region, thematicArea } = router.query;
  return (
    <>
      <Head>
        <title>Events - The WHO Traditional Medicine Global Library</title>
      </Head>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/events", name: "Events" },
          ]}
          blackColor={true}
        />
        <Flex justify={"space-between"} align={"center"} px={15} mt={30}>
          <h3 className={styles.TitleWithIcon} style={{ margin: "5px" }}>
            {capitalizeFirstLetter("Events")}
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
          <p>{globalConfig?.acf.events_description}</p>
        </Flex>
        <EventsFeed
          thematicArea={thematicArea ? thematicArea.toString() : undefined}
          country={country ? country.toString() : undefined}
          region={region ? region.toString() : undefined}
          displayType={displayType}
        />
      </Container>
    </>
  );
}
