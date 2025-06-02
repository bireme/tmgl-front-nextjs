import { Button, Center, Container, Flex, Modal } from "@mantine/core";
import { useCallback, useContext, useEffect, useState } from "react";

import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import { DimensionsSection } from "@/components/sections";
import { EventsSection } from "@/components/sections/events";
import { FixedRelatedVideosSection } from "@/components/videos";
import { GlobalContext } from "@/contexts/globalContext";
import { HeroSlider } from "@/components/slider";
import { HomeAcf } from "@/services/types/homeAcf.dto";
import { IconArrowRight } from "@tabler/icons-react";
import { ImageSection } from "@/components/video";
import Link from "next/link";
import { NewsSection } from "@/components/sections/news";
import { NewsletterSection } from "@/components/sections/newsletter";
import { PagesApi } from "@/services/pages/PagesApi";
import { SearchForm } from "@/components/forms/search";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingSlider } from "@/components/rss/slider";
import styles from "../styles/pages/home.module.scss";

export default function Home() {
  const _api = new PagesApi();
  const [properties, setProperties] = useState();
  const [sliderImages, setSliderImages] = useState<Array<AcfImageArray>>();
  const [acf, setAcf] = useState<HomeAcf>();
  const { setRegionName } = useContext(GlobalContext);
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
    setRegionName("");
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
      <ImageSection>
        <Container size={"xl"} py={"5%"} className={styles.TraditionalMedicine}>
          <h2>
            <img src={"/local/svg/simbol.svg"} />
            {acf?.tmd.title}
          </h2>
          <Center m={0} p={0}>
            <h4>{acf?.tmd.subtitle}</h4>
          </Center>

          <DimensionsSection items={acf?.itens} />
        </Container>
      </ImageSection>
      <div className={styles.TrandingAndFeatured}>
        <Container
          size={"xl"}
          mt={80}
          className={styles.TrandingAndFeaturedContainer}
        >
          <h2 className={`${styles.TitleWithIcon} ${styles.center}`}>
            Recent literature reviews
          </h2>
          <div className={styles.TrendingText}>
            <p>{acf?.text_trending_topics}</p>
            <Link
              href={"/recent-literature-reviews"}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "18px",
              }}
            >
              <Flex justify={"flex-start"} align={"center"} gap={10}>
                <p>Explore more</p>{" "}
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
          <h2 className={styles.TitleWithIcon}> Events</h2>
        </Container>
      </div>
      <EventsSection />
      <div className={styles.NewsContainer}>
        <NewsSection title={true} />
        <FixedRelatedVideosSection
          items={[
            {
              title:
                "Traditional medicine: WHO Director General addresses the Group of Friends of Traditional Medicine ",
              href: "https://www.youtube.com/watch?v=xEaxxGiyANM&t=1s",
              thumbnail: "https://img.youtube.com/vi/xEaxxGiyANM/sddefault.jpg",
            },
            {
              title: "The WHO Global Centre for Traditional Medicine ",
              href: "https://www.youtube.com/watch?v=wsMwFRMfe1I",
              thumbnail: "https://img.youtube.com/vi/wsMwFRMfe1I/sddefault.jpg",
            },
            {
              title:
                "Traditional Medicine: five areas of work of the WHO Global Centre for Traditional Medicine (GCTM)",
              href: "https://www.youtube.com/watch?v=F6_qCT5T1ys",
              thumbnail: "https://img.youtube.com/vi/F6_qCT5T1ys/sddefault.jpg",
            },
          ]}
        />
        <NewsletterSection />
      </div>
    </>
  );
}
