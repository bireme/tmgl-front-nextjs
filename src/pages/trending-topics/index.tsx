import { Container, Grid } from "@mantine/core";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { FeedSection } from "@/components/feed";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function TrendingTopics() {
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
        <p>
          Lorem ipsum dolor sit amet consectetur. Mi nec enim sit nulla. Elit
          hac quis et pellentesque dictum id iaculis ac. Gravida malesuada
          mauris eu quis in duis. Sed neque duis turpis at. In semper eu aliquet
          sit odio sapien turpis. Enim eu dictum magnis magna sed sed.
          Condimentum quam at erat libero adipiscing urna non.
        </p>
        <FeedSection postType="trending_topics" />
      </Container>
    </>
  );
}
