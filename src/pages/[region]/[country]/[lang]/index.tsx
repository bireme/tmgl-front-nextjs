import { Container, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { CountryAcfProps, Post } from "@/services/types/posts.dto";
import {
  FundingAndPeriodicalsSection,
  JournalsSection,
  NewsEventsSection,
  PagesSection,
} from "@/components/sections";
import { HeroImage, HeroSlider } from "@/components/slider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { CountryResourceSection } from "@/components/sections/countryResourceSection";
import { FixedRelatedVideosSection } from "@/components/videos";
import { GlobalContext } from "@/contexts/globalContext";
import { PostsApi } from "@/services/posts/PostsApi";
import { SearchForm } from "@/components/forms/search";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingCarrocel } from "@/components/rss/slider";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

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
  const [thematicPageTag, setThematicPageTag] = useState();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "resize" && iframeRef.current) {
        iframeRef.current.style.height = `${event.data.height + 200}px`;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getPageProperties = useCallback(async () => {
    setRegionName(region ? region.toString() : "");
    const thematicPageResp = await _postApiHelper.getTagBySlug("thematic-page");
      setThematicPageTag(thematicPageResp[0]?.id);
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
          console.log(
            "Searching for country term with slug:",
            country.toString()
          );

          // Usar API regional para buscar o termo de país
          const countryTerm = await _api.getCountryBySlug(country.toString());
          console.log("Country term found in regional API:", countryTerm);

          // Se não encontrou, tentar com primeira letra maiúscula
          if (!countryTerm || countryTerm.length === 0) {
            const capitalizedCountry =
              country.toString().charAt(0).toUpperCase() +
              country.toString().slice(1);
            console.log("Trying with capitalized name:", capitalizedCountry);
            const countryTermCapitalized = await _api.getCountryBySlug(
              capitalizedCountry
            );
            console.log(
              "Capitalized country term found in regional API:",
              countryTermCapitalized
            );

            if (countryTermCapitalized && countryTermCapitalized.length > 0) {
              const countryId = countryTermCapitalized[0].id;
              console.log("Setting countryTermId to:", countryId);
              setCountryTermId(countryId);
            }
          } else {
            const countryId = countryTerm[0].id;
            console.log("Setting countryTermId to:", countryId);
            setCountryTermId(countryId);
          }

          // Buscar news e events relacionados ao país
          // Buscar news do WP geral (não regional)
          console.log("countryTermId", countryTermId);
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
                        <h3>{properties?.translate_labels.key_resources_label || "Links to key resources"}</h3>
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
                  {properties?.tms_title || "Traditional Medicine Systems"}
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
          {properties?.news_title || properties?.events_title ? (
            <NewsEventsSection
              news={news}
              events={events}
              newsTitle={properties?.news_title || "News from WHO"}
              otherNewsTitle={
                properties?.translate_labels.news_label || "Other News"
              }
              eventsTitle={properties?.events_title || "Events"}
              otherEventsTitle={
                properties?.translate_labels.events_label || "Other Events"
              }
              showMoreNewsLink={"/news"}
              showMoreEventsLink={"/events"}
              exploreAllLabel={"Explore all"}
            />
          ) : (
            <></>
          )}

          {properties?.research_block_content ? (
            <Container size={"xl"} mt={80} mb={80}>
              <div className={styles.ResearchBlock}>
                <h3 className={styles.TitleWithIcon}>
                  {properties?.research_block_title || "Research"}
                </h3>
                <div className={styles.researchBlockContent}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: properties?.research_block_content || "",
                    }}
                  />
                </div>
              </div>
            </Container>
          ) : (
            <></>
          )}

          {properties?.embed_content ? (
            <>
              <div className={styles.EmbedContent}>
                {/* <Container size={"xl"}>
                  <h3 className={styles.TitleWithIcon}>
                    TM Research Analytics{" "}
                  </h3>
                  <p>
                    {decodeHtmlEntities(
                      globalConfig?.acf.tm_research_analytics_descriptor
                        ? globalConfig?.acf.tm_research_analytics_descriptor
                        : ""
                    )}
                  </p>
                </Container> */}
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

          <TrendingCarrocel
            allFilter={
              !properties?.rss_filter
                ? country
                  ? country.toString()
                  : undefined
                : undefined
            }
            title={properties?.translate_labels.rss_label || "Recent literature reviews"}
            rssString={
              properties?.rss_filter ? properties?.rss_filter : undefined
            }
          />

          {(properties?.founding_oportunity_heading || 
            properties?.periodicals_heading ||
            properties?.founding_oportunities_items?.length || 
            properties?.periodical_items?.length) && (
            <FundingAndPeriodicalsSection
              fundingOpportunities={properties?.founding_oportunities_items || []}
              periodicals={properties?.periodical_items || []}
              fundingHeading={properties?.founding_oportunity_heading}
              otherFundingTitle={properties?.other_funding_title || "Chamadas em aberto"}
              otherPeriodicalsTitle={properties?.other_periodicals_title || ""}
              periodicalsHeading={properties?.periodicals_heading}
              fundingTitle={properties?.founding_oportunity_title || "Oportunidades de Financiamento"}
              periodicalsTitle={properties?.periodicals_title|| "Periódicos"}
              exploreAllLabel="Explore all"
            />
          )}

          <Container size={"xl"}> 
                <Grid>
                  <Grid.Col span={6}> 
                  {properties?.search_institute_items && properties.search_institute_items.length > 0 && (
                      <CountryResourceSection
                        resources={properties.search_institute_items.map(i => {
                          return {
                            title: i.title,
                            url: i.url,
                            icon: i.image as string,
                          }
                        })}
                        title={properties?.search_institute_title || "Instituições de pesquisa"}
                      />
                    )}
                  </Grid.Col>
                  <Grid.Col span={6}> 
                  {properties?.search_group_title && properties.search_group_items.length > 0 && (
                      <CountryResourceSection
                        resources={properties.search_group_items.map(i => {
                          return {
                            title: i.title,
                            url: i.url,
                            icon: i.image as string,
                          }
                        })}
                        title={properties?.search_group_title || "Grupos de pesquisa"}
                      />
                    )}
                  </Grid.Col>
                </Grid>
          </Container>
                    
          <PagesSection
            countryId={countryTermId || undefined}
            region={region ? region.toString() : undefined}
          />
          


          <CountryResourceSection
            resources={properties?.resources}
            title={properties?.resources_title || "Resources"}
          />

          <Container size={"xl"}> 
            <StoriesSection title={properties?.stories_title || "Featured stories"} fetchOptions={{ countryId: countryTermId || undefined, excludeCountry: false, tagId: thematicPageTag, excludeTag: true }} />
          </Container>

          {properties?.manual_media ? (
            <>
              <div style={{ float: "left", width: "100%", backgroundColor: "#D9D9D9" }}>

                <FixedRelatedVideosSection
                  title={properties?.multimedia_title || "Related videos"}
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
