import { Container, Grid } from "@mantine/core";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { FeedSection } from "@/components/feed";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/pages/pages.module.scss";
import { useContext } from "react";
import { useRouter } from "next/router";

export default function TrendingTopics() {
  const { globalConfig } = useContext(GlobalContext);
  return (
    <>
      <Container size={"xl"} py={60}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/trending-topics", name: "Trending Topics" },
          ]}
          blackColor={true}
        />
        <h2 className={styles.TitleWithIcon}> Trending Topics</h2>
        <p>{globalConfig?.acf.trending_description}</p>
        <FeedSection postType="trending_topics" />
      </Container>
    </>
  );
}
