import { Container, Flex } from "@mantine/core";
import { EventsFeedSection, FeedSection } from "@/components/feed";
import { IconLayoutGrid, IconLayoutList } from "@tabler/icons-react";
import { useContext, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/pages/home.module.scss";

export default function EventsFeed() {
  const { globalConfig } = useContext(GlobalContext);
  const [displayType, setDisplayType] = useState<string>("column");
  return (
    <>
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
            <img src={"/local/svg/simbol.svg"} />
            Events
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
        <EventsFeedSection />
      </Container>
    </>
  );
}
