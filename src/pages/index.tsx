import { Container, Flex, Grid, Text } from "@mantine/core";

import { HeroSlider } from "@/components/slider";
import { SearchForm } from "@/components/forms/search";
import { TraditionalSectionCard } from "@/components/sections";
import { TrendingSlider } from "@/components/slider/trending";
import { VideoSection } from "@/components/video";
import styles from "../styles/pages/home.module.scss";

export default function Home() {
  return (
    <>
      <div className={styles.HeroSearch}>
        <HeroSlider />
        <div className={styles.FullContainer}>
          <Container size={"xl"}>
            <SearchForm />
          </Container>
        </div>
      </div>
      <VideoSection>
        <Container size={"xl"} py={"5%"} className={styles.TraditionalMedicine}>
          <h2>
            <img src={"/local/svg/simbol.svg"} />
            Traditional Medicine Dimensions
          </h2>
          <h4>
            Lorem ipsum dolor sit amet consectetur. Gravida eu augue ullamcorper{" "}
            <br /> duis. Id nec mollis proin nullam. At odio ornare.
          </h4>
          <Flex
            mt={80}
            direction={"row"}
            wrap={"wrap"}
            gap={80}
            justify={"center"}
            align={"center"}
          >
            <TraditionalSectionCard
              iconPath="/local/png/tmd-1.png"
              target=""
              title={
                <>
                  Health & <br /> Well-being
                </>
              }
            />
            <TraditionalSectionCard
              iconPath="/local/png/tmd-2.png"
              target=""
              title={
                <>
                  Leadership &<br />
                  Policies
                </>
              }
            />
            <TraditionalSectionCard
              iconPath="/local/png/tmd-3.png"
              target=""
              title={
                <>
                  Research &<br />
                  Evidence
                </>
              }
            />
            <TraditionalSectionCard
              iconPath="/local/png/tmd-4.png"
              target=""
              title={
                <>
                  Health Systems
                  <br />& Services
                </>
              }
            />
            <TraditionalSectionCard
              iconPath="/local/png/tmd-5.png"
              target=""
              title={
                <>
                  Digital Health
                  <br />
                  Frontiers
                </>
              }
            />
            <TraditionalSectionCard
              iconPath="/local/png/tmd-6.png"
              target=""
              title={
                <>
                  Biodiversity &<br />
                  Sustainability
                </>
              }
            />
            <TraditionalSectionCard
              iconPath="/local/png/tmd-7.png"
              target=""
              title={
                <>
                  Rights, Equity
                  <br />& Ethics
                </>
              }
            />
            <TraditionalSectionCard
              iconPath="/local/png/tmd-8.png"
              target=""
              title={
                <>
                  TM for
                  <br />
                  Daily Life
                </>
              }
            />
          </Flex>
        </Container>
      </VideoSection>
      <div className={styles.TrandingAndFeatured}>
        <Container size={"xl"} my={80}>
          <h2 className={styles.TitleWithIcon}>
            <img src={"/local/svg/simbol.svg"} /> Trending Topics
          </h2>
          <div className={styles.TrendingText}>
            <p>
              Delve into various themes such as traditional practices,
              complementary therapies, integrative approaches, and more.
            </p>
          </div>
          <TrendingSlider />
        </Container>
      </div>
      <div style={{ height: "4000px", background: "black" }}></div>
    </>
  );
}
