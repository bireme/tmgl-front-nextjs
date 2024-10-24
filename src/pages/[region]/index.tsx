import { useCallback, useContext, useEffect, useState } from "react";

import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import { Container } from "@mantine/core";
import { EventsSection } from "@/components/sections/events";
import { GlobalContext } from "@/contexts/globalContext";
import { HeroSlider } from "@/components/slider";
import { HomeAcf } from "@/services/types/homeAcf.dto";
import { NewsSection } from "@/components/sections/news";
import { NewsletterSection } from "@/components/sections/newsletter";
import { PagesApi } from "@/services/pages/PagesApi";
import { RegionalDimensions } from "@/components/sections/dimensions";
import { SearchForm } from "@/components/forms/search";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingSlider } from "@/components/slider/trending";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function RegionHome() {
  const router = useRouter();
  const { setRegionName, regionName } = useContext(GlobalContext);
  const [sliderImages, setSliderImages] = useState<Array<AcfImageArray>>();
  const [acf, setAcf] = useState<HomeAcf>();
  const {
    query: { region },
  } = router;

  const getPageProperties = useCallback(async () => {
    const _api = new PagesApi(region ? region.toString() : "");
    setRegionName(region ? region.toString() : "");
    try {
      const resp = await _api.getPageProperties("home");
      setAcf(resp[0].acf);
      setSliderImages(resp[0].acf.search.slider_images);
      console.log(regionName);
    } catch {
      console.log("Error while get home properties");
    }
  }, [region]);

  useEffect(() => {
    if (region) getPageProperties();
  }, [getPageProperties]);

  return (
    <div style={{ overflowX: "hidden" }}>
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
      <div>
        {acf ? (
          <>
            <RegionalDimensions
              acf={acf}
              region={region ? region.toString() : ""}
            />
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
                </div>
                <TrendingSlider />
              </Container>
              <Container size={"xl"}>
                <StoriesSection region={region ? region.toString() : ""} />
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
              background={acf?.events.background}
            />
            <div className={styles.NewsContainer}>
              <Container size={"xl"} py={80}>
                <h2 className={styles.TitleWithIcon}>
                  <img src={"/local/svg/simbol.svg"} /> News
                </h2>
                {/* <NewsSection region={region ? region.toString() : undefined} /> */}
              </Container>
              <NewsletterSection />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
