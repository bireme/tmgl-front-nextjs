import { Container, Grid } from "@mantine/core";
import { FeedSection, TrendingTopicsFeedSection } from "@/components/feed";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import styles from "../../styles/pages/pages.module.scss";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { capitalizeFirstLetter } from "@/helpers/stringhelper";

export default function TrendingTopics() {
  const { globalConfig } = useContext(GlobalContext);
  const router = useRouter();
  const { filter } = router.query;


  return (
    <>
      <Head>
        <title>Recent Literature Review - The WHO Traditional Medicine Global Library</title>
      </Head>
      <Container size={"xl"} py={60}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/recent-literature-reviews", name: "Recent literature review" },
          ]}
          blackColor={true}
        />
        <h1 className={styles.TitleWithIcon}>{capitalizeFirstLetter("Recent Literature Review")}</h1>
        <p>{globalConfig?.acf.trending_description}</p>
        <TrendingTopicsFeedSection
          filter={filter ? filter.toString() : undefined}
        />
      </Container>
    </>
  );
}
