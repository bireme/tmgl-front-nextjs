import { BreadCrumbs } from "@/components/breadcrumbs";
import { Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { StoriesFeed } from "@/components/feed/stories";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../../styles/pages/home.module.scss";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function FeaturedStories() {
  const { globalConfig } = useContext(GlobalContext);
  const [displayType, setDisplayType] = useState<string>("column");
  const router = useRouter();
  const { country, region, thematicArea } = router.query;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !router.isReady) {
    return (
      <Container size={"xl"} py={40}>
        <div>Loading...</div>
      </Container>
    );
  }

  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: `/${region}`, name: region?.toString().toUpperCase() || "REGION" },
            { path: `/${region}/featured-stories`, name: "Featured stories" },
          ]}
          blackColor={true}
        />
        <Flex justify={"space-between"} align={"center"} px={15} mt={30}>
          <h3 className={styles.TitleWithIcon} style={{ margin: "5px" }}>
            Featured stories
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
            {globalConfig?.acf.stories_description}
          </p>
        </Flex>
        <StoriesFeed
          displayType={displayType}
          country={country ? country.toString() : undefined}
          region={region ? region.toString() : undefined}
          thematicArea={thematicArea ? thematicArea.toString() : undefined}
        />
      </Container>
    </>
  );
}
