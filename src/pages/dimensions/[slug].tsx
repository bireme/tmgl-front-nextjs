import {
  Button,
  Center,
  Container,
  Flex,
  Grid,
  LoadingOverlay,
} from "@mantine/core";
import {
  RecentMultimediaItems,
  RelatedVideosSection,
} from "@/components/videos";
import {
  RecomendedArticlesSection,
  RelatedArticlesSection,
} from "@/components/sections/recomended";
import { TrendingCarrocel, TrendingSlider } from "@/components/rss/slider";
import { useCallback, useContext, useEffect, useState } from "react";

import { DimensionMultitab } from "@/components/multitab/dimension";
import { DimensionRelatedResources } from "@/services/types/dimensionsAcf";
import { GlobalContext } from "@/contexts/globalContext";
import { HeroHeader } from "@/components/sections/hero";
import { IconArrowRight } from "@tabler/icons-react";
import { IconCard } from "@/components/cards";
import { MediaApi } from "@/services/media/MediaApi";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function Dimensions() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>();
  const [children, setChildren] = useState<Array<Post>>([]);
  const _mediaApi = new MediaApi();
  const _api = new PostsApi();

  const getArticles = async (fatherId?: number) => {
    try {
      const resp = await _api.getCustomPost("dimensions", 10, fatherId);
      setChildren(resp);
    } catch (error: any) {
      console.log("Error while getting Childrens", error);
    }
  };

  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("dimensions", slug);
      setPost(resp[0]);
      await getArticles(resp[0].id);
    } catch {
      console.log("Error while trying to get dimension");
    }
  }, []);

  useEffect(() => {
    if (slug) getPost(slug.toString());
  }, [getPost, slug]);

  return (
    <>
      {post ? (
        <>
          <HeroHeader
            post={post}
            path={[
              { path: "/", name: "HOME" },
              { path: "/dimensions", name: "TM Dimensions" },
              {
                path: `/dimensions/${post.slug}`,
                name: decodeHtmlEntities(post.title.rendered),
              },
            ]}
            type="TM Dimensions"
          />
          <DimensionMultitab content={post.content.rendered} />
          <Container size={"xl"}>
            {children.length > 0 ? (
              <>
                {children?.map((child, index) => {
                  return (
                    <Grid key={index}>
                      <Grid.Col span={{ base: 12, md: 9 }}>
                        <h3 className={styles.PostPageSubtitle}>
                          {child.title.rendered}
                        </h3>
                        <div
                          className={styles.PostContentFragment}
                          dangerouslySetInnerHTML={{
                            __html: child.content.rendered,
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 3 }} px={20} py={60}>
                        <img
                          src={_mediaApi.findFeaturedMedia(child, "full")}
                          width={"100%"}
                        />
                        {child.acf?.related_resources?.length > 0 && (
                          <Flex
                            mt={50}
                            direction={"column"}
                            gap={"25px"}
                            justify={"center"}
                            align={"center"}
                          >
                            {child.acf.related_resources.map(
                              (
                                resource: DimensionRelatedResources,
                                index: number
                              ) => {
                                return (
                                  <IconCard
                                    small={true}
                                    title={resource.title}
                                    icon={
                                      <>
                                        <Center mb={5}>
                                          <img src={resource.icon} />
                                        </Center>
                                      </>
                                    }
                                    callBack={() =>
                                      window.open(resource.target, "_blank")
                                    }
                                    key={index}
                                  />
                                );
                              }
                            )}
                          </Flex>
                        )}
                      </Grid.Col>
                    </Grid>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </Container>

          <div style={{ background: "#FBFBFB" }}>
            {post.acf?.related_resources?.length > 0 ? (
              <Container py={40} size={"xl"}>
                <h2 className={styles.TitleWithIcon}>Related Resources</h2>
                <Flex mt={50} gap={"3%"} justify={"space-around"}>
                  {post.acf.related_resources.map(
                    (resource: DimensionRelatedResources, index: number) => {
                      return (
                        <IconCard
                          title={resource.title}
                          icon={
                            <>
                              <img src={resource.icon} />
                            </>
                          }
                          callBack={() =>
                            window.open(resource.target, "_blank")
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
            )}

            <TrendingCarrocel
              rssString={
                post.acf?.rss_feed
                  ? post.acf.rss_feed != ""
                    ? post.acf.rss_feed
                    : undefined
                  : undefined
              }
            />
          </div>
        </>
      ) : (
        <LoadingOverlay visible={true} />
      )}
    </>
  );
}
