import { EventsFeedSection, FeedSection } from "@/components/feed";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { Container } from "@mantine/core";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/pages/home.module.scss";
import { useContext } from "react";

export default function EventsFeed() {
  const { globalConfig } = useContext(GlobalContext);

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
        <h2 className={styles.TitleWithIcon}>
          <img src={"/local/svg/simbol.svg"} />
          Events
        </h2>
        <p>{globalConfig?.acf.events_description}</p>
        <EventsFeedSection />
      </Container>
    </>
  );
}
