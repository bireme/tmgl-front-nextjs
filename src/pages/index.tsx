import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
  Modal,
  Text,
} from "@mantine/core";
import {
  DimensionsSection,
  TraditionalSectionCard,
} from "@/components/sections";
import { NewsItem, NewsSection } from "@/components/sections/news";
import { useCallback, useEffect, useState } from "react";

import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import { EventsSection } from "@/components/sections/events";
import { HeroSlider } from "@/components/slider";
import { HomeAcf } from "@/services/types/homeAcf.dto";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { MediaApi } from "@/services/media/MediaApi";
import { NewsletterSection } from "@/components/sections/newsletter";
import { PagesApi } from "@/services/pages/PagesApi";
import { SearchForm } from "@/components/forms/search";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingSlider } from "@/components/slider/trending";
import { VideoSection } from "@/components/video";
import styles from "../styles/pages/home.module.scss";

export default function Home() {
  const _api = new PagesApi();
  const [properties, setProperties] = useState();
  const [sliderImages, setSliderImages] = useState<Array<AcfImageArray>>();
  const [acf, setAcf] = useState<HomeAcf>();
  const [showModal, setShowModal] = useState(false);

  const getPageProperties = useCallback(async () => {
    try {
      const resp = await _api.getPageProperties("home-global");
      setProperties(resp[0]);
      setAcf(resp[0].acf);
      setSliderImages(resp[0].acf.search.slider_images);
    } catch {
      console.log("Error while get home properties");
    }
  }, []);

  useEffect(() => {
    getPageProperties();
  }, [getPageProperties]);

  return (
    <>
      <Modal
        title={"Warning"}
        onClose={() => setShowModal(false)}
        opened={showModal}
      ></Modal>
      <div className={styles.HeroSearch}>
        {sliderImages ? <HeroSlider images={sliderImages} /> : <></>}

        <div className={styles.FullContainer}>
          <Container size={"xl"}>
            <SearchForm
              title={acf?.search.title ? acf?.search.title : ""}
              subtitle={acf?.search.subtitle ? acf.search.subtitle : ""}
            />
          </Container>
        </div>
      </div>
      <VideoSection>
        <Container size={"xl"} py={"5%"} className={styles.TraditionalMedicine}>
          <h2>
            <img src={"/local/svg/simbol.svg"} />
            {acf?.tmd.title}
          </h2>
          <Center m={0} p={0}>
            <h4>{acf?.tmd.subtitle}</h4>
          </Center>

          <DimensionsSection />
        </Container>
      </VideoSection>
      <div className={styles.TrandingAndFeatured}>
        <Container
          size={"xl"}
          mt={80}
          className={styles.TrandingAndFeaturedContainer}
        >
          <h2 className={styles.TitleWithIcon}>
            <img src={"/local/svg/simbol.svg"} /> Trending Topics
          </h2>
          <div className={styles.TrendingText}>
            <p>{acf?.text_trending_topics}</p>
            <Link
              href={"/trending-topics"}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "18px",
              }}
            >
              <Flex justify={"flex-start"} align={"center"} gap={10}>
                <p>Explore more trending topics</p>{" "}
                <Button p={5} size={"xs"}>
                  <IconArrowRight />
                </Button>
              </Flex>
            </Link>
          </div>
          <TrendingSlider />
        </Container>
        <Container size={"xl"}>
          <StoriesSection />
          <Link
            href={"/featured-stories"}
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "18px",
            }}
          >
            <Flex justify={"flex-start"} align={"center"} gap={10}>
              <p>Explore more featured stories</p>{" "}
              <Button p={5} size={"xs"}>
                <IconArrowRight />
              </Button>
            </Flex>
          </Link>
          <br></br>
          <h2 className={styles.TitleWithIcon}>
            <img src={"/local/svg/simbol.svg"} /> Events
          </h2>
        </Container>
      </div>
      <EventsSection
        title={acf?.events.title ? acf.events.title : ""}
        subtitle={acf?.events.subtitle ? acf.events.subtitle : ""}
        webcast={acf?.events.webcast}
        meeting={acf?.events.meeting}
        repport={acf?.events.repport}
      />
      <div className={styles.NewsContainer}>
        <Container size={"xl"} py={80}>
          <h2 className={styles.TitleWithIcon}>
            <img src={"/local/svg/simbol.svg"} /> News
          </h2>
          <NewsSection />
        </Container>
        <NewsletterSection />
      </div>
    </>
  );
}
