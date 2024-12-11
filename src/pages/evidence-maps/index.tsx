import { Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import { ResourcesFeedSection } from "@/components/feed/lis/feedSection";
import styles from "../../styles/pages/home.module.scss";

export default function EvidenceMapsFeed() {
  const { globalConfig } = useContext(GlobalContext);

  const [displayType, setDisplayType] = useState<string>("column");
  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/evidence-maps", name: "Evidence Maps" },
          ]}
        />
        <Flex justify={"space-between"} align={"center"}>
          <h2 className={styles.TitleWithIcon}>
            <img src={"/local/svg/simbol.svg"} />
            Evidence Maps Platform
          </h2>
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

        <p></p>
        <ResourcesFeedSection
          thematicArea="TMGL-EV"
          displayType={displayType}
        />
      </Container>
    </>
  );
}
