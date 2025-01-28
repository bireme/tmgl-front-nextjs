import { BreadCrumbs } from "@/components/breadcrumbs";
import { Container } from "@mantine/core";
import { FeedSection } from "@/components/feed";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/pages/home.module.scss";
import { useContext } from "react";

export default function News() {
  const { globalConfig } = useContext(GlobalContext);

  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/news", name: "News" },
          ]}
          blackColor={true}
        />
        <h2 className={styles.TitleWithIcon}>
          <img src={"/local/svg/simbol.svg"} />
          News from WHO GTMC
        </h2>
        <p>{globalConfig?.acf.news_description}</p>
        <FeedSection postType="news" />
      </Container>
    </>
  );
}
