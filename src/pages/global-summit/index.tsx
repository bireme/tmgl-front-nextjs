import { Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import { GlobalSummitFeed } from "@/components/feed/globalsummit";
import { RepositoriesFeed } from "@/components/feed/repositories";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function GlobalSummit() {
  const { globalConfig } = useContext(GlobalContext);

  const router = useRouter();
  const { country, region, thematicArea } = router.query;
  const [displayType, setDisplayType] = useState<string>("column");
  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          blackColor
          path={[
            { path: "/", name: "HOME" },
            {
              path: "/global-summit",
              name: "WHO TM Global Summit no menú Resources",
            },
          ]}
        />
        <Flex justify={"space-between"} align={"center"} px={15} mt={30}>
          <h3 className={styles.TitleWithIcon}>
            WHO TM Global Summit no menú Resources
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
          <p>{globalConfig?.acf.who_tm_global_summit_description}</p>
        </Flex>
        <GlobalSummitFeed
          thematicArea={thematicArea ? thematicArea.toString() : undefined}
          country={country ? country.toString() : undefined}
          region={region ? region.toString() : undefined}
          displayType={displayType}
        />
      </Container>
    </>
  );
}
