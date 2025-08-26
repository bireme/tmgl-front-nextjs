import {
  ACFMultimediaItem,
  Post,
  SimilarTheme,
  ThematicPageAcfProps,
} from "@/services/types/posts.dto";
import {
  BackgroundImage,
  Button,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
  Title,
} from "@mantine/core";
import { DefaultCard, ResourceCard } from "@/components/feed/resourceitem";
import { HeroImage, HeroSlider } from "@/components/slider";
import { IconArrowRight, IconTemperature } from "@tabler/icons-react";
import { IconCard, ImageCard } from "@/components/cards";
import {
  decodeHtmlEntities,
  decodeHtmlLink,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useCallback, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { FixedRelatedVideosSection } from "@/components/videos";
import { PostsApi } from "@/services/posts/PostsApi";
import { SearchForm } from "@/components/forms/search";
import { TrendingCarrocel } from "@/components/rss/slider";
import styles from "../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function ThematicPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<ThematicPageAcfProps>();
  const [postProps, setPostProps] = useState<Post>();
  const [news, setNews] = useState<Array<Post>>([]);
  const _api = new PostsApi();
  const {
    query: { slug },
  } = router;

  const getPageProperties = useCallback(async () => {
    if (slug) {
      const postResponse = await _api.getPost(
        "thematic-pages",
        slug.toString()
      );
      if (postResponse.length > 0) {
        setPostProps(postResponse[0]);
        setProperties(postResponse[0].acf);
      }
      if (postResponse[0]?.acf?.news_tag_filter) {
        let tag = await _api.getTagBySlug(
          postResponse[0]?.acf?.news_tag_filter
        );
        if (tag) {
          let tagId = tag[0]?.id;
          const newsResponse = await _api.getCustomPost(
            "posts",
            4,
            undefined,
            undefined,
            undefined,
            { tagId: [tagId], excludeTag: false }
          );
          setNews(newsResponse);
        }
      }
    }
  }, [slug]);

  useEffect(() => {
    getPageProperties();
  }, [slug]);

  return (
    <>
      {postProps ? (
        <>
          <div className={`${styles.HeroSearch} ${styles.small}`}>
            {properties?.search.slider_images ? (
              <HeroSlider images={properties?.search.slider_images} />
            ) : (
              <></>
            )}

            <div className={styles.FullContainer}>
              <Container size={"xl"}>
                <br />
                <BreadCrumbs
                  path={[
                    {
                      path: `/home`,
                      name: "Home",
                    },
                    {
                      path: `/thematic-page/${slug}`,
                      name: slug ? slug.toString() : "",
                    },
                  ]}
                  blackColor={false}
                />
                <SearchForm
                  small={true}
                  title={
                    properties?.search.title ? properties?.search.title : ""
                  }
                  subtitle={
                    properties?.search.subtitle
                      ? properties.search.subtitle
                      : ""
                  }
                />
              </Container>
            </div>
          </div>
          <div className={styles.TmPageContent}>
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
                    {properties?.community_iniciatives && (
                      <div className={styles.KeyResources}>
                        <h3>{properties?.comunity_initiatives_title}</h3>
                        {properties?.community_iniciatives.map((keyR, key) => {
                          return (
                            <p key={key}>
                              <a href={keyR.url} target={"_blank"}>
                                {decodeHtmlEntities(keyR.label)}
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
          <div className={styles.CountryRersources}>
            {properties ? (
              properties?.similar_themes?.length > 0 ? (
                <Container py={40} size={"xl"}>
                  <h3 className={styles.TitleWithIcon}>Related Themes</h3>
                  <Flex
                    mt={50}
                    gap={{ base: "20px", md: "3%" }}
                    justify={"space-around"}
                    direction={{ base: "column", sm: "row" }}
                    wrap={"wrap"}
                  >
                    {properties?.similar_themes.map(
                      (resource: SimilarTheme, index: number) => {
                        return (
                          <ImageCard
                            title={resource.title}
                            icon={
                              <>
                                <div
                                  className={styles.imageCardImage}
                                  style={{
                                    backgroundImage: `url(${resource.image})`,
                                  }}
                                />
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
                      (resource: ACFMultimediaItem, index: number) => {
                        return (
                          <IconCard
                            title={resource.title}
                            icon={
                              <>
                                <img src={resource.image} />
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
            allFilter={properties?.rss_filter}
            rssString={
              properties?.rss_filter ? properties?.rss_filter : undefined
            }
          />
          <Container size={"xl"} py={60}>
            <Grid>
              {news.length > 0 ? (
                <Grid.Col span={{ md: 6, base: 12 }}>
                  <h3 className={styles.TitleWithIcon}>News</h3>
                  <Flex
                    gap="30px"
                    wrap="wrap"
                    direction="row"
                    justify="space-between"
                    align="stretch"
                  >
                    {/* Coluna esquerda */}
                    <div style={{ flex: 1, display: "flex" }}>
                      <ResourceCard
                        fullWidth
                        title={news[0].title.rendered}
                        displayType="column"
                        excerpt={removeHTMLTagsAndLimit(
                          news[0].excerpt.rendered,
                          180
                        )}
                        image={_api.findFeaturedMedia(news[0], "large")}
                        link={`/news/${news[0].slug}`}
                        tags={[]}
                      />
                    </div>
                    {news.length > 1 ? (
                      <div style={{ flex: 1, display: "flex" }}>
                        <DefaultCard
                          fullWidth
                          displayType="column"
                          style={{
                            flex: 1,
                            backgroundColor: "white",
                            alignItems: "flex-start",
                          }}
                        >
                          <h3
                            style={{ width: "100%" }}
                            className={`${styles.BlueTitle} ${styles.small}`}
                          >
                            Other News
                          </h3>

                          {news.slice(1, 4).map((item, key) => (
                            <a
                              className={styles.linkTitle}
                              href={""}
                              key={key}
                              style={{}}
                            >
                              {item.title.rendered}
                            </a>
                          ))}
                        </DefaultCard>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Flex>
                  {properties?.show_more_news_link ? (
                    <Flex
                      mt={25}
                      gap={10}
                      align={"center"}
                      onClick={() => {
                        properties?.show_more_news_link;
                      }}
                      component="a"
                      style={{ cursor: "pointer" }}
                    >
                      Explore all{" "}
                      <Button size={"xs"} p={5}>
                        <IconArrowRight stroke={1} />
                      </Button>
                    </Flex>
                  ) : (
                    <></>
                  )}
                </Grid.Col>
              ) : (
                <></>
              )}
              {/* <Grid.Col span={{ md: 6, base: 12 }}>
                <h3 className={styles.TitleWithIcon}>Events</h3>
              </Grid.Col> */}
            </Grid>
          </Container>

          {properties?.multimedia_items ? (
            <>
              <div style={{ float: "left", width: "100%" }}>
                <FixedRelatedVideosSection
                  items={
                    properties?.multimedia_items
                      ? properties?.multimedia_items?.map((item) => {
                          return {
                            title: item.title,
                            href: item.url,
                            thumbnail: item.image,
                          };
                        })
                      : []
                  }
                />
              </div>
              {properties?.more_media_url ? (
                <Flex
                  mt={25}
                  gap={10}
                  align={"center"}
                  onClick={() => {
                    properties?.more_media_url;
                  }}
                  component="a"
                  style={{ cursor: "pointer" }}
                >
                  Explore all{" "}
                  <Button size={"xs"} p={5}>
                    <IconArrowRight stroke={1} />
                  </Button>
                </Flex>
              ) : (
                <></>
              )}
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
