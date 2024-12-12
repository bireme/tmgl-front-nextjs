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
          blackColor
          path={[
            { path: "/", name: "HOME" },
            { path: "/journals", name: "Journals" },
          ]}
        />
        <Flex justify={"space-between"} align={"center"} px={10} mt={0}>
          <h3 className={styles.TitleWithIcon}>
            <img src={"/local/svg/simbol.svg"} />
            Journals
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
          <p>{globalConfig?.acf.journals_description}</p>
        </Flex>
        <ResourcesFeedSection
          resourceType="journals"
          thematicArea="TMGL"
          repository="journals"
          displayType={displayType}
        />
      </Container>
    </>
  );
}
