import { Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { EvidenceMapsFeed } from "@/components/feed/evidencemaps";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/pages/home.module.scss";

export default function EvidenceMaps() {
  const { globalConfig } = useContext(GlobalContext);
  //const router = useRouter();
  // const [country, region, thematic-area] = router.query;
  const [displayType, setDisplayType] = useState<string>("column");
  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          blackColor
          path={[
            { path: "/", name: "HOME" },
            { path: "/evidence-maps", name: "Evidence Maps" },
          ]}
        />
        <Flex justify={"space-between"} align={"center"} px={15} mt={30}>
          <h3 className={styles.TitleWithIcon} style={{ margin: "5px" }}>
            <img src={"/local/svg/simbol.svg"} />
            Evidence Maps
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
            {globalConfig?.acf.evidence_maps_description}
          </p>
        </Flex>

        <EvidenceMapsFeed displayType={displayType} />
      </Container>
    </>
  );
}
