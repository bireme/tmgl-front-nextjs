import { Center, Container, Flex } from "@mantine/core";
import { useCallback, useContext, useEffect, useState } from "react";

import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import { DimensionsSection } from "@/components/sections";
import { EventsSection } from "@/components/sections/events";
import { FixedRelatedVideosSection } from "@/components/videos";
import { GlobalContext } from "@/contexts/globalContext";
import { HeroSlider } from "@/components/slider";
import { HomeAcf } from "@/services/types/homeAcf.dto";
import { ImageSection } from "@/components/video";
import { NewsSection } from "@/components/sections/news";
import { NewsletterSection } from "@/components/sections/newsletter";
import { PagesApi } from "@/services/pages/PagesApi";
import { RegionalDimensions } from "@/components/sections/dimensions";
import { SearchForm } from "@/components/forms/search";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingSlider } from "@/components/rss/slider";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function RegionHome() {
  const router = useRouter();
  const { setRegionName, regionName } = useContext(GlobalContext);
  const { globalConfig } = useContext(GlobalContext);
  const [sliderImages, setSliderImages] = useState<Array<AcfImageArray>>();
  const [acf, setAcf] = useState<HomeAcf>();
  const {
    query: { region },
  } = router;

  const getPageProperties = useCallback(async () => {
    const _api = new PagesApi(region ? region.toString() : "");
    setRegionName(region ? region.toString() : "");

    if (globalConfig) {
      if (
        !globalConfig?.acf.regionais?.find(
          (region) =>
            region.rest_api_prefix.toLocaleLowerCase() ==
            regionName.toLocaleLowerCase()
        ) &&
        !globalConfig?.acf.route?.find(
          (r) => r.url === window.location.origin + router.asPath
        )
      ) {
        setRegionName("");
        router.push("/404");
      } else {
        setRegionName(region ? region.toString() : "");
      }
    }

    try {
      const resp = await _api.getPageProperties("home");
      setAcf(resp[0].acf);
      setSliderImages(resp[0].acf.search.slider_images);
    } catch {
      console.log("Error while get home properties");
    }
  }, [region, globalConfig]);

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
            {acf?.resources?.length > 0 ? (
              <ImageSection>
                <Container
                  size={"xl"}
                  py={"5%"}
                  className={styles.TraditionalMedicine}
                >
                  <h2>{acf?.region_resources_title}</h2>
                  <Center m={0} p={0}>
                    <h4>{acf?.region_resources_subtitle}</h4>
                  </Center>

                  <DimensionsSection items={acf?.resources} />
                </Container>
              </ImageSection>
            ) : (
              <></>
            )}
            <RegionalDimensions
              acf={acf}
              region={region ? region.toString() : ""}
            />
            {acf.collaboration_network_items?.length > 0 && (
              <div className={styles.CollaborationNetworkContainer}>
                <Container size={"xl"} py={20}>
                  <Center>
                    <h2>Collaboration Network</h2>
                  </Center>
                  <Flex gap={30} align={"center"} justify={"center"}>
                    {acf?.collaboration_network_items?.length > 0 &&
                      acf?.collaboration_network_items.map((item, index) => (
                        <div
                          key={index}
                          className={styles.CollaborationNetworkItemContainer}
                        >
                          <div
                            style={{ backgroundImage: `url('${item.url}')` }}
                            className={styles.CollaborationNetworkItem}
                          ></div>
                          <p>{item.title}</p>
                        </div>
                      ))}
                  </Flex>
                </Container>
              </div>
            )}

            <div className={styles.TrandingAndFeatured}>
              <Container
                size={"xl"}
                mt={80}
                className={styles.TrandingAndFeaturedContainer}
              >
                <h2 className={styles.TitleWithIcon}>
                  Recent Literature Review
                </h2>
                <div className={styles.TrendingText}>
                  <p>{acf?.text_trending_topics}</p>
                </div>
                <TrendingSlider />
              </Container>
              <Container size={"xl"}>
                <StoriesSection region={region ? region.toString() : ""} />
                <h2 className={styles.TitleWithIcon}> Events</h2>
              </Container>
            </div>
            <EventsSection />
            <div className={styles.NewsContainer}>
              <NewsSection
                region={region ? region.toString() : ""}
                title={true}
              />
              <NewsletterSection />
            </div>
            <br />
            <br />
            {acf?.manual_media && acf.manual_media.length > 0 ? (
              <div style={{ float: "left", width: "100%" }}>
                <FixedRelatedVideosSection
                  items={acf.manual_media.map((item) => {
                    return {
                      title: item.title,
                      href: item.url,
                      thumbnail: item.image,
                    };
                  })}
                />
              </div>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
