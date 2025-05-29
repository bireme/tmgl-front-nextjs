import { Container, Flex, Grid, Loader, LoadingOverlay } from "@mantine/core";
import {
  CountryAcfProps,
  CountryAcfResource,
  Post,
} from "@/services/types/posts.dto";
import { HeroImage, HeroSlider } from "@/components/slider";
import { decodeHtmlEntities, decodeHtmlLink } from "@/helpers/stringhelper";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { EventsSection } from "@/components/sections/events";
import { FixedRelatedVideosSection } from "@/components/videos";
import { GlobalContext } from "@/contexts/globalContext";
import { IconCard } from "@/components/cards";
import { PostsApi } from "@/services/posts/PostsApi";
import { SearchForm } from "@/components/forms/search";
import { TrendingCarrocel } from "@/components/rss/slider";
import styles from "../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function CountryHome() {
  const router = useRouter();
  const _postApiHelper = new PostsApi();
  const [properties, setProperties] = useState<CountryAcfProps>();
  const { setRegionName, setCountryName } = useContext(GlobalContext);
  const [postProps, setPostProps] = useState<Post>();
  const {
    query: { country, region },
  } = router;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "resize" && iframeRef.current) {
        iframeRef.current.style.height = `${event.data.height}px`;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getPageProperties = useCallback(async () => {
    setRegionName(region ? region.toString() : "");
    setCountryName(country ? country.toString() : "");
    const _api = new PostsApi(region ? region.toString() : "");
    if (country) {
      const postResponse = await _api.getPost("countries", country.toString());
      if (postResponse.length > 0) {
        setPostProps(postResponse[0]);
        setProperties(postResponse[0].acf);
      }
    }
  }, [region, country]);

  useEffect(() => {
    getPageProperties();
  }, [region, country]);

  return (
    <>
      {postProps ? (
        <>
          <div className={styles.HeroSearch}>
            {properties?.slide_images ? (
              <HeroSlider images={properties.slide_images} />
            ) : (
              <HeroImage
                image={_postApiHelper.findFeaturedMedia(postProps, "full")}
              />
            )}

            <div className={styles.FullContainer}>
              <Container size={"xl"}>
                <br />
                <BreadCrumbs
                  path={[
                    {
                      path: `/${region}`,
                      name: region ? region?.toString().toUpperCase() : "",
                    },
                    {
                      path: `/${country}`,
                      name: country ? country.toString() : "",
                    },
                  ]}
                  blackColor={false}
                />
                <div className={styles.fixSearchForm}>
                  <SearchForm
                    title="Discover a comprehensive resource for traditional medicine."
                    subtitle="Access a wealth of scientific and technical information, regional insights, and global strategies."
                  />
                </div>
              </Container>
            </div>
          </div>
          <div className={styles.CountryContent}>
            <Container size={"xl"} my={40}>
              <Grid>
                <Grid.Col span={{ md: 9, base: 12 }} px={20}>
                  <h2>{postProps.title.rendered}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: properties?.content ? properties?.content : "",
                    }}
                  />
                </Grid.Col>
                <Grid.Col span={{ md: 3, base: 12 }} px={20}>
                  <div className={styles.SideContent}>
                    {properties?.key_resources && (
                      <div className={styles.KeyResources}>
                        <h3>Links to key resources</h3>
                        {properties?.key_resources.map((keyR, key) => {
                          return (
                            <p key={key}>
                              <a href={keyR.url} target={"_blank"}>
                                {decodeHtmlEntities(keyR.text)}
                              </a>
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Grid.Col>
              </Grid>
            </Container>
          </div>

          {properties?.tms_items?.length &&
          properties?.tms_items?.length > 0 ? (
            <div className={styles.Tms}>
              <Container size={"xl"}>
                <h3 className={styles.TitleWithIcon}>
                  Traditional Medicine Systems
                </h3>
                <Flex
                  justify={"center"}
                  align={"center"}
                  direction={{ base: "column", md: "row" }}
                  gap={20}
                >
                  {properties?.tms_items?.map((item, index) => {
                    return (
                      <div className={styles.TmsItem} key={index}>
                        <div
                          className={styles.TmsImage}
                          style={{ backgroundImage: `url(${item.image})  ` }}
                        />
                        <h4>{item.title}</h4>
                      </div>
                    );
                  })}
                </Flex>
              </Container>
            </div>
          ) : (
            <></>
          )}

          {properties?.embed_content ? (
            <>
              <div className={styles.EmbedContent}>
                <Container size={"xl"}>
                  <h3 className={styles.TitleWithIcon}>
                    TM Research Analytics{" "}
                  </h3>
                </Container>
                {properties?.embed_content ? (
                  <iframe
                    ref={iframeRef}
                    src={properties?.embed_content}
                    width="100%"
                    height="600"
                  />
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : (
            <></>
          )}

          <div className={styles.CountryRersources}>
            {properties ? (
              properties?.resources?.length > 0 ? (
                <Container py={40} size={"xl"}>
                  <h3 className={styles.TitleWithIcon}>Resources</h3>
                  <Flex
                    mt={50}
                    gap={{ base: "20px", md: "3%" }}
                    justify={"space-around"}
                    direction={{ base: "column", sm: "row" }}
                    wrap={"wrap"}
                  >
                    {properties?.resources.map(
                      (resource: CountryAcfResource, index: number) => {
                        return (
                          <IconCard
                            title={resource.title}
                            icon={
                              <>
                                <img src={resource.icon} />
                              </>
                            }
                            callBack={() =>
                              window.open(
                                decodeHtmlLink(resource.url),
                                "_blank"
                              )
                            }
                            key={index}
                          />
                        );
                      }
                    )}
                  </Flex>
                </Container>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </div>

          <TrendingCarrocel
            allFilter={country ? country.toString() : undefined}
          />
          {region ? (
            <EventsSection region={region ? region.toString() : ""} />
          ) : (
            <></>
          )}
          {properties?.manual_media ? (
            <>
              <div style={{ float: "left", width: "100%" }}>
                <FixedRelatedVideosSection
                  items={
                    properties?.manual_media
                      ? properties?.manual_media?.map((item) => {
                          return {
                            title: item.title,
                            href: item.url,
                            thumbnail: item.image.sizes.medium_large,
                          };
                        })
                      : []
                  }
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <div style={{ height: "100vh" }}>
          <LoadingOverlay visible={true} />
        </div>
      )}
    </>
  );
}
