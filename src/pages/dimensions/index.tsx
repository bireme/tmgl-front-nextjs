import { BreadCrumbs } from "@/components/breadcrumbs";
import { Container } from "@mantine/core";
import { GlobalContext } from "@/contexts/globalContext";
import styles from "../../styles/pages/home.module.scss";
import { useContext } from "react";

export default function FeaturedStories() {
  const { globalConfig } = useContext(GlobalContext);
  return (
    <>
      <Container size={"xl"} py={40}>
        <BreadCrumbs
          path={[
            { path: "/", name: "HOME" },
            { path: "/dimensions", name: "TM Dimensions" },
          ]}
          blackColor={true}
        />
        <h2 className={styles.TitleWithIcon}>
          <img src={"/local/svg/simbol.svg"} />
          TM Dimensions
        </h2>
        <p>{globalConfig?.acf.dimensions_description}</p>
        <FeedSection postType="dimensions" />
      </Container>
    </>
  );
}
