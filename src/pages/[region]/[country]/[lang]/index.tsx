import { Alert, Button, Container, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { CountryAcfProps, Post } from "@/services/types/posts.dto";
import {
  FundingAndPeriodicalsSection,
  NewsEventsSection,
  PagesSection,
} from "@/components/sections";
import { HeroImage, HeroSlider } from "@/components/slider";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { CountryResourceSection } from "@/components/sections/countryResourceSection";
import { DefaultResourceItemDto } from "@/services/types/defaultResource";
import { DireveService } from "@/services/apiRepositories/DireveService";
import { FixedRelatedVideosSection } from "@/components/videos";
import { GlobalContext } from "@/contexts/globalContext";
import Head from "next/head";
import { IconArrowRight } from "@tabler/icons-react";
import { NewsEventsItem } from "@/services/types/newsEvents.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { SearchForm } from "@/components/forms/search";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingCarrocel } from "@/components/rss/slider";
import { _optional } from "zod/v4/core";
import { decodeHtmlEntities, capitalizeFirstLetter } from "@/helpers/stringhelper";
import styles from "../../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function CountryHome() {
  const router = useRouter();
  const _postApiHelper = new PostsApi();
  const [properties, setProperties] = useState<CountryAcfProps>();
  const { setRegionName, setCountryName, globalConfig, countryName } =
    useContext(GlobalContext);
  const _service = new DireveService();
  const [postProps, setPostProps] = useState<Post>();
  const [news, setNews] = useState<Array<NewsEventsItem>>([]);
  const [events, setEvents] = useState<Array<NewsEventsItem>>([]);
  const [regionalCountryTermId, setRegionalCountryTermId] = useState<
    number | null
  >(null);
  const [countryTermId, setCountryTermId] = useState<number | null>(null);
  const {
    query: { country, region, lang },
  } = router;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Função para mapear Post para NewsEventsItem
  const mapPostToNewsEventsItem = (post: Post): NewsEventsItem => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    featured_media: post.featured_media,
    _embedded: post._embedded,
  });

  // Função para mapear DefaultResourceItemDto para NewsEventsItem
  const mapDireveToNewsEventsItem = (
    item: DefaultResourceItemDto
  ): NewsEventsItem => ({
    id: parseInt(item.id) || 0,
    slug: item.link.split("/").pop() || item.id,
    title: { rendered: item.title },
    excerpt: { rendered: item.excerpt },
    featured_media: 0,
    _embedded: item.thumbnail
      ? {
          "wp:featuredmedia": [
            {
              id: 0,
              media_details: {
                sizes: {
                  thumbnail: {
                    source_url: item.thumbnail,
                    width: 150,
                    height: 150,
                  },
                  medium: {
                    source_url: item.thumbnail,
                    width: 300,
                    height: 200,
                  },
                  large: {
                    source_url: item.thumbnail,
                    width: 600,
                    height: 400,
                  },
                  full: {
                    source_url: item.thumbnail,
                    width: 1200,
                    height: 800,
                  },
                },
              },
              source_url: item.thumbnail,
            },
          ],
        }
      : undefined,
  });

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
          const globalApi = new PostsApi();
          let countryId = null;
          // Usar API regional para buscar o termo de país
          const countryTerm = await globalApi.getCountryBySlug(
            country.toString()
          );

          // Se não encontrou, tentar com primeira letra maiúscula
          if (!countryTerm || countryTerm.length === 0) {
            const capitalizedCountry =
              country.toString().charAt(0).toUpperCase() +
              country.toString().slice(1);
            const countryTermCapitalized = await globalApi.getCountryBySlug(
              capitalizedCountry
            );

            if (countryTermCapitalized && countryTermCapitalized.length > 0) {
              countryId = countryTermCapitalized[0].id;
              setCountryTermId(countryId);
            }
          } else {
            countryId = countryTerm[0].id;
            setCountryTermId(countryId);
          }

          const regionalCountryTerm = await _api.getCountryBySlug(
            country.toString()
          );
          if (!regionalCountryTerm || regionalCountryTerm.length === 0) {
            const capitalizedCountry =
              country.toString().charAt(0).toUpperCase() +
              country.toString().slice(1);
            const countryTermCapitalized = await _api.getCountryBySlug(
              capitalizedCountry
            );

            if (countryTermCapitalized && countryTermCapitalized.length > 0) {
              countryId = countryTermCapitalized[0].id;
              setRegionalCountryTermId(countryId);
            }
          } else {
            countryId = countryTerm[0].id;
            setRegionalCountryTermId(countryId);
          }

          // Buscar news e events relacionados ao país
          // Buscar news do WP geral (não regional)
          // Sem região para acessar WP geral
          const newsResponse = await globalApi.getCustomPost(
            "posts",
            4,
            undefined,
            undefined,
            undefined,
            {
              countryId: [countryId || 0],
            }
          );

          setNews(newsResponse.map(mapPostToNewsEventsItem));

          //Buscando events no FIAdmin
          const eventsResponse = await _service.getDefaultResources(
            4,
            0,
            "pt-br",
            [{ parameter: "country", query: country.toString() }]
          );
          setEvents(eventsResponse.data.map(mapDireveToNewsEventsItem));

          //setEvents(eventsResponse);
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
      <Head>
        <title>{countryName ? `${countryName} - ` : ''}The WHO Traditional Medicine Global Library</title>
      </Head>
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
                  {
                    properties?.other_version && (
                      <Alert mt={20} style={{cursor: "pointer"}} onClick={() => router.push(properties?.other_version.link)} color="blue">
                        {properties?.other_version.description}
                      </Alert>
                    )
                  }
                </Grid.Col>
                <Grid.Col span={{ md: 3, base: 12 }} px={20}>
                  <div className={styles.SideContent}>
                    {properties?.key_resources && (
                      <div className={styles.KeyResources}>
                        <h3>
                          {properties?.translate_labels.key_resources_label ||
                            "Links to key resources"}
                        </h3>
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
                    {capitalizeFirstLetter(properties?.tms_title || "TRADITIONAL MEDICINE SYSTEMS")}
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
                        <div onClick={() => item.url ? router.push(item.url) : undefined} className={styles.TmsItem} key={index}>
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
              exploreAllLabel={
                properties?.translate_labels.rss_see_more_label || "Explore all"
              }
            />
          ) : (
            <></>
          )}

          {properties?.research_block_content ? (
            <Container size={"xl"} mt={80} mb={80}>
              <div className={styles.ResearchBlock}>
                <h3 className={styles.TitleWithIcon}>
                  {capitalizeFirstLetter(properties?.research_block_title || "RESEARCH")}
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
            title={
              properties?.translate_labels.rss_label ||
              "Recent literature reviews"
            }
            rssString={
              properties?.rss_filter ? properties?.rss_filter : undefined
            }
            exploreAllLabel={
              properties?.translate_labels.rss_see_more_label || "Explore all"
            }
          />

          {(properties?.founding_oportunity_heading ||
            properties?.periodicals_heading ||
            properties?.founding_oportunities_items?.length ||
            properties?.periodical_items?.length) && (
            <FundingAndPeriodicalsSection
              fundingOpportunities={
                properties?.founding_oportunities_items || []
              }
              periodicals={properties?.periodical_items || []}
              fundingHeading={properties?.founding_oportunity_heading}
              otherFundingTitle={
                properties?.other_funding_title || "Chamadas em aberto"
              }
              otherPeriodicalsTitle={properties?.other_periodicals_title || ""}
              periodicalsHeading={properties?.periodicals_heading}
              fundingTitle={
                properties?.founding_oportunity_title ||
                "Oportunidades de Financiamento"
              }
              periodicalsTitle={properties?.periodicals_title || "Periódicos"}
              exploreAllLabel="Explore all"
              hideExploreAllPeriodicals={true}
              hideExploreAllFunding={true}
              hideSeeMoreButtonFunding={true}
              hideSeeMoreButtonPeriodicals={true}
            />
          )}

          <Container size={"xl"}>
            <Grid>
              <Grid.Col span={6}>
                {properties?.search_institute_items &&
                  properties.search_institute_items.length > 0 && (
                    <CountryResourceSection
                      resources={properties.search_institute_items.map((i) => {
                        return {
                          title: i.title,
                          url: i.url,
                          icon: i.image as string,
                        };
                      })}
                      title={
                        properties?.search_institute_title ||
                        "Instituições de pesquisa"
                      }
                    />
                  )}
              </Grid.Col>
              <Grid.Col span={6}>
                {properties?.search_group_title &&
                  properties.search_group_items.length > 0 && (
                    <CountryResourceSection
                      resources={properties.search_group_items.map((i) => {
                        return {
                          title: i.title,
                          url: i.url,
                          icon: i.image as string,
                        };
                      })}
                      title={
                        properties?.search_group_title || "Grupos de pesquisa"
                      }
                    />
                  )}
              </Grid.Col>
            </Grid>
          </Container>

          <PagesSection
            buttonLabel={
              properties?.translate_labels.rss_see_more_label || "see more"
            }
            countrySlug={country ? country.toString() : undefined}
            region={region ? region.toString() : undefined}
          />

          <CountryResourceSection
            resources={properties?.resources}
            title={properties?.resources_title || "Resources"}
          />

          <Container size={"xl"}>
            <StoriesSection
              regionApi={region ? region.toString() : undefined}
              buttonLabel={properties?.stories_button_label || "see more"}
              title={properties?.stories_title || "Featured stories"}
              fetchOptions={{
                countryId: countryTermId || undefined,
                excludeCountry: false,
                tagId: globalConfig?.acf.thematic_page_tag,
                excludeTag: true,
              }}
            />
            {properties?.stories_url && (
              <Flex
                mt={25}
                gap={10}
                align={"center"}
                onClick={() => {
                  // Handle more media action
                }}
                component="a"
                style={{ cursor: "pointer" }}
              >
                {properties.stories_button_label || "see more"}{" "}
                <Button size={"xs"} p={5}>
                  <IconArrowRight stroke={1} />
                </Button>
              </Flex>
            )}
          </Container>

          {properties?.manual_media ? (
            <>
              <div
                style={{
                  float: "left",
                  width: "100%",
                  backgroundColor: "#D9D9D9",
                }}
              >
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

                <Container mt={-40} pt={0} mb={40} size={"xl"}>
                  {properties.multimedia_filter && (
                    <Flex
                      mt={25}
                      gap={10}
                      align={"center"}
                      onClick={() => {
                        window.open(properties.multimedia_filter, "self");
                      }}
                      component="a"
                      style={{ cursor: "pointer" }}
                    >
                      {properties.translate_labels.rss_see_more_label}{" "}
                      <Button size={"xs"} p={5}>
                        <IconArrowRight stroke={1} />
                      </Button>
                    </Flex>
                  )}
                </Container>
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