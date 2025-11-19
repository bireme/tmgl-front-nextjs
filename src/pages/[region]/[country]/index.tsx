import { Alert, Container, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { CountryAcfProps, Post } from "@/services/types/posts.dto";
import { HeroImage, HeroSlider } from "@/components/slider";
import {
  JournalsSection,
  NewsEventsSection,
  PagesSection,
} from "@/components/sections";
import { useCallback, useContext, useEffect, useState } from "react";
import { EmbedIframe } from "@/components/embed/EmbedIframe";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { CountryResourceSection } from "@/components/sections/countryResourceSection";
import { FixedRelatedVideosSection } from "@/components/videos";
import { GlobalContext } from "@/contexts/globalContext";
import { PostsApi } from "@/services/posts/PostsApi";
import { SearchForm } from "@/components/forms/search";
import { TrendingCarrocel } from "@/components/rss/slider";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";
import { IconAlertCircleFilled } from "@tabler/icons-react";

export default function CountryHome() {
  const router = useRouter();
  const _postApiHelper = new PostsApi();
  const [properties, setProperties] = useState<CountryAcfProps>();
  const { setRegionName, setCountryName, globalConfig, countryName } =
    useContext(GlobalContext);
  const [postProps, setPostProps] = useState<Post>();
  const [news, setNews] = useState<Array<Post>>([]);
  const [events, setEvents] = useState<Array<Post>>([]);
  const [countryTermId, setCountryTermId] = useState<number | null>(null);
  const {
    query: { country, region },
  } = router;

  const getPageProperties = useCallback(async () => {
    setRegionName(region ? region.toString() : "");
    setCountryName(country ? country.toString() : "");
    const _api = new PostsApi(region ? region.toString() : "");
    if (country) {
      const postResponse = await _api.getPost("countries", country.toString());
      if (postResponse.length > 0) {
        setCountryName(postResponse[0].title.rendered);
        setPostProps(postResponse[0]);
        setProperties(postResponse[0].acf);

        // Buscar termo do país para usar como filtro
        try {

          // Usar API regional para buscar o termo de país
          const countryTerm = await _api.getCountryBySlug(country.toString());

          // Se não encontrou, tentar com primeira letra maiúscula
          if (!countryTerm || countryTerm.length === 0) {
            const capitalizedCountry =
              country.toString().charAt(0).toUpperCase() +
              country.toString().slice(1);
            const countryTermCapitalized = await _api.getCountryBySlug(
              capitalizedCountry
            );

            if (countryTermCapitalized && countryTermCapitalized.length > 0) {
              const countryId = countryTermCapitalized[0].id;
              setCountryTermId(countryId);
            }
          } else {
            const countryId = countryTerm[0].id;
            setCountryTermId(countryId);
          }

          // Buscar news e events relacionados ao país
          // Buscar news do WP geral (não regional)
          const globalApi = new PostsApi(); // Sem região para acessar WP geral

          const newsResponse = await globalApi.getCustomPost(
            "posts",
            4,
            undefined,
            undefined,
            undefined,
            {
              countryId: [countryTermId || 0],
            }
          );

          setNews(newsResponse);

          // Buscar events do país (pode manter regional se necessário)
          const eventsResponse = await _api.getCustomPost(
            "event",
            4,
            undefined,
            undefined,
            undefined,
            {
              countryId: [countryTermId || 0],
            }
          );
          setEvents(eventsResponse);
        } catch (error) {
          console.error(
            "Error fetching country term and related content:",
            error
          );
        }
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
                      name: countryName ? countryName.toString() : "",
                    },
                  ]}
                  blackColor={false}
                />
                <div className={styles.fixSearchForm}>
                  <SearchForm
                    title="Discover a comprehensive resource for traditional medicine"
                    subtitle="Access a wealth of scientific and technical information, regional insights and global strategies"
                  />
                </div>
              </Container>
            </div>
          </div>
          <div className={styles.CountryContent}>
            <Container size={"xl"} my={40}>
              <Grid>
                <Grid.Col span={{ md: 9, base: 12 }} px={20}>
                  {properties?.disclaimer && (
                    <div className={styles.Disclaimer}>
                      <Alert color="yellow">
                        <Flex align={"center"} gap={10}>
                          <IconAlertCircleFilled size={60} color={"#dab526"} />
                          <div dangerouslySetInnerHTML={{ __html: properties?.disclaimer }} />
                        </Flex>
                      </Alert>
                    </div>
                  )}
                  <h2>{postProps.title.rendered}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: properties?.content ? properties?.content : "",
                    }}
                  />
                  {
                    properties?.other_version && (
                      <Alert mt={20} style={{ cursor: "pointer" }} onClick={() => router.push(properties?.other_version.link)} color="blue">
                        {properties?.other_version.description}
                      </Alert>
                    )
                  }
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
          {properties?.tms_items &&
            Array.isArray(properties?.tms_items) &&
            properties?.tms_items?.length > 0 ? (
            <div className={styles.Tms}>
              <Container size={"xl"}>
                <h3 className={styles.TitleWithIcon}>
                  Traditional Medicine Systems
                </h3>
                <Flex
                  justify={"center"}
                  align={"center"}
                  wrap={"wrap"}
                  direction={{ base: "column", md: "row" }}
                  gap={25}
                >
                  {properties?.tms_items?.map((item, index) => {
                    return (
                      <div className={styles.TmsItem} key={index}>
                        <div
                          className={styles.TmsImage}
                          style={{ backgroundImage: `url(${item.image})  ` }}
                        />
                        <h4>
                          {item.title
                            ? item.title.length > 120
                              ? item.title.substring(0, 120) + "..."
                              : item.title
                            : ""}
                        </h4>
                        <p>{item.description}</p>
                      </div>
                    );
                  })}
                </Flex>
              </Container>
            </div>
          ) : (
            <></>
          )}
          <NewsEventsSection
            news={news}
            events={events}
            newsTitle="News from WHO"
            otherNewsTitle="Other News"
            eventsTitle="Events"
            otherEventsTitle="Other Events"
            showMoreNewsLink="/news"
            showMoreEventsLink="/events"
            exploreAllLabel="Explore all"
          />
          {properties?.embed_content ? (
            <>
              <div className={styles.EmbedContent}>
                <Container size={"xl"}>
                  {/* <h3 className={styles.TitleWithIcon}>
                    TM Research Analytics{" "}
                  </h3>
                  <p>
                    {decodeHtmlEntities(
                      globalConfig?.acf.tm_research_analytics_descriptor
                        ? globalConfig?.acf.tm_research_analytics_descriptor
                        : ""
                    )}
                  </p> */}
                  {properties?.embed_content ? (
                    <EmbedIframe
                      src={properties.embed_content}
                      width="100%"
                      height={600}
                    />
                  ) : (
                    <></>
                  )}
                </Container>

              </div>
            </>
          ) : (
            <></>
          )}

          <CountryResourceSection
            resources={properties?.resources}
            title={properties?.resources_title || "Resources"}
          />

          <TrendingCarrocel
            allFilter={
              !properties?.rss_filter
                ? country
                  ? country.toString()
                  : undefined
                : undefined
            }
            rssString={
              properties?.rss_filter ? properties?.rss_filter : undefined
            }
          />

          <JournalsSection
            country={country ? country.toString() : undefined}
            region={region ? region.toString() : undefined}
            title="Journals"
            archive="journals"
          />

          <PagesSection
            countrySlug={country ? country.toString() : undefined}
            region={region ? region.toString() : undefined}
          />

          {/* {region ? (
            <EventsSection region={region ? region.toString() : ""} />
          ) : (
            <></>
          )} */}
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
