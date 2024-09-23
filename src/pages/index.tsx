import {
  Center,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import {
  DimensionsSection,
  TraditionalSectionCard,
} from "@/components/sections";
import { NewsItem, NewsSection } from "@/components/sections/news";
import { useCallback, useEffect, useState } from "react";

import { EventsSection } from "@/components/sections/events";
import { HeroSlider } from "@/components/slider";
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
  const _mediaApi = new MediaApi();
  const [properties, setProperties] = useState();
  const [sliderImages, setSliderImages] = useState<Array<string>>();
  const [acf, setAcf] = useState<HomeAcf>();

  const getSliderImages = async (acfSearch: AcfSearch) => {
    let images = [];
    if (acfSearch.slide_image_1)
      images[0] = await _mediaApi.getMediaById(acfSearch.slide_image_1);
    if (acfSearch.slide_image_2)
      images[1] = await _mediaApi.getMediaById(acfSearch.slide_image_2);
    if (acfSearch.slide_image_3)
      images[2] = await _mediaApi.getMediaById(acfSearch.slide_image_3);
    if (acfSearch.slide_image_4)
      images[3] = await _mediaApi.getMediaById(acfSearch.slide_image_4);
    if (acfSearch.slide_image_5)
      images[4] = await _mediaApi.getMediaById(acfSearch.slide_image_5);
    if (acfSearch.slide_image_5)
      images[5] = await _mediaApi.getMediaById(acfSearch.slide_image_5);
    if (acfSearch.slide_image_5)
      images[6] = await _mediaApi.getMediaById(acfSearch.slide_image_5);
    return images;
  };

  const getPageProperties = useCallback(async () => {
    try {
      const resp = await _api.getPageProperties("home-global");
      setProperties(resp[0]);
      setAcf(resp[0].acf);
      const imagesResp = await getSliderImages(resp[0].acf.search);
      setSliderImages(imagesResp);
    } catch {
      console.log("Error while get home properties");
    }
  }, []);

  useEffect(() => {
    getPageProperties();
  }, [getPageProperties]);

  return (
    <>
      <div className={styles.HeroSearch}>
        {sliderImages ? (
          <HeroSlider images={sliderImages} />
        ) : (
          <LoadingOverlay visible={true} />
        )}

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
        <Container size={"xl"} mt={80} style={{ minHeight: "600px" }}>
          <h2 className={styles.TitleWithIcon}>
            <img src={"/local/svg/simbol.svg"} /> Trending Topics
          </h2>
          <div className={styles.TrendingText}>
            <p>{acf?.text_trending_topics}</p>
          </div>
          <TrendingSlider />
        </Container>
        <Container size={"xl"}>
          <StoriesSection />
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
