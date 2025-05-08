import { Container, Flex, Grid, Loader } from "@mantine/core";
import {
  CountryAcfProps,
  CountryAcfResource,
  Post,
} from "@/services/types/posts.dto";
import { HeroImage, HeroSlider } from "@/components/slider";
import { TrendingCarrocel, TrendingSlider } from "@/components/rss/slider";
import { useCallback, useContext, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { DimensionRelatedResources } from "@/services/types/dimensionsAcf";
import { GlobalContext } from "@/contexts/globalContext";
import { IconCard } from "@/components/cards";
import { PostsApi } from "@/services/posts/PostsApi";
import { SearchForm } from "@/components/forms/search";
import styles from "../../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function CountryHome() {
  const router = useRouter();
  const _postApiHelper = new PostsApi();
  const [properties, setProperties] = useState<CountryAcfProps>();
  const [postProps, setPostProps] = useState<Post>();
  const {
    query: { country, region },
  } = router;

  const getPageProperties = useCallback(async () => {
    const _api = new PostsApi(region ? region.toString() : "");
    if (country) {
      const postResponse = await _api.getPost("country", country.toString());
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
                <SearchForm
                  title="Discover a comprehensive resource for traditional medicine."
                  subtitle="Access a wealth of scientific and technical information, regional insights, and global strategies."
                />
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
                            <a key={key} href={keyR.url} target={"_blank"}>
                              {keyR.text}
                            </a>
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
              properties?.resources?.length > 0 ? (
                <Container py={40} size={"xl"}>
                  <h3 className={styles.TitleWithIcon}>Resources</h3>
                  <Flex mt={50} gap={"3%"} justify={"space-around"}>
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
                            callBack={() => window.open(resource.url, "_blank")}
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
          <div className={styles.CountryRss}>
            <Container py={10} size={"xl"}>
              <h3 className={styles.TitleWithIcon}>
                Recent literature reviews
              </h3>
              <TrendingCarrocel />
            </Container>
          </div>
          {/* <div className={styles.CountryEvents}>
            <Container py={10} size={"xl"}>
              <h4>Recent literature reviews</h4>
            </Container>
          </div> */}
        </>
      ) : (
        <>
          <Loader color="blue" />
        </>
      )}
    </>
  );
}
