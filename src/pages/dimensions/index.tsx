import { BreadCrumbs } from "@/components/breadcrumbs";
import { Container } from "@mantine/core";
import { FeedSection } from "@/components/feed";
import styles from "../../styles/pages/home.module.scss";
export default function FeaturedStories() {
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
        <p>
          Lorem ipsum dolor sit amet consectetur. Mi nec enim sit nulla. Elit
          hac quis et pellentesque dictum id iaculis ac. Gravida malesuada
          mauris eu quis in duis. Sed neque duis turpis at. In semper eu aliquet
          sit odio sapien turpis. Enim eu dictum magnis magna sed sed.
          Condimentum quam at erat libero adipiscing urna non.
        </p>
        <FeedSection postType="dimensions" />
      </Container>
    </>
  );
}
