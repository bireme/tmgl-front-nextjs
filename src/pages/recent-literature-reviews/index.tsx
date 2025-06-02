import { Container, Grid } from "@mantine/core";
import { FeedSection, TrendingTopicsFeedSection } from "@/components/feed";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/pages/pages.module.scss";
import { useContext } from "react";
import { useRouter } from "next/router";

export default function TrendingTopics() {
  const { globalConfig } = useContext(GlobalContext);
  const router = useRouter();
  const { filter } = router.query;
  if (!router.isReady) return null;
  return (
    <>
      <Container size={"xl"} py={60}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/recent-literature-", name: "Recent Literature Review" },
          ]}
          blackColor={true}
        />
        <h2 className={styles.TitleWithIcon}> Recent Literature Review</h2>
        <p>{globalConfig?.acf.trending_description}</p>
        <TrendingTopicsFeedSection
          filter={filter ? filter.toString() : undefined}
        />
      </Container>
    </>
  );
}
