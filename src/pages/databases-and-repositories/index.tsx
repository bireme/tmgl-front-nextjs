import { Container, Flex } from "@mantine/core";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import { RepositoriesFeed } from "@/components/feed/repositories";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function DatabaseRepositories() {
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
            { path: "/database-repositories", name: "Database Repositories" },
          ]}
        />
        <Flex justify={"space-between"} align={"center"} px={15} mt={30}>
          <h3 className={styles.TitleWithIcon}>Database & Repositories</h3>

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
          <p>{globalConfig?.acf.database_repositories_descriptions}</p>
        </Flex>
        {/* Precisa filtrar pelo database_source */}
        <RepositoriesFeed
          thematicArea={thematicArea ? thematicArea.toString() : undefined}
          country={country ? country.toString() : undefined}
          region={region ? region.toString() : undefined}
          displayType={displayType}
        />
      </Container>
    </>
  );
}
