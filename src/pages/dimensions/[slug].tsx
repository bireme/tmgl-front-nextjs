import { Button, Container, Grid, LoadingOverlay } from "@mantine/core";
import {
  RecomendedArticlesSection,
  RelatedArticlesSection,
} from "@/components/sections/recomended";
import { TrendingCarrocel, TrendingSlider } from "@/components/rss/slider";
import { useCallback, useContext, useEffect, useState } from "react";

import { DimensionMultitab } from "@/components/multitab/dimension";
import { GlobalContext } from "@/contexts/globalContext";
import { HeroHeader } from "@/components/sections/hero";
import { IconArrowRight } from "@tabler/icons-react";
import { MediaApi } from "@/services/media/MediaApi";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { RelatedVideosSection } from "@/components/videos";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function Dimensions() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>();
  const { globalConfig } = useContext(GlobalContext);
  const [children, setChildren] = useState<Array<Post>>([]);
  const [releatedNumber, setReleatedNumber] = useState(0);
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
          <Container py={100} size={"xl"}>
            {children.length > 0 ? (
              <>
                {children.map((child, index) => {
                  return (
                    <Grid key={index}>
                      <Grid.Col span={{ base: 12, md: 8 }} p={40}>
                        <h3 className={styles.PostPageSubtitle}>
                          {child.title.rendered}
                        </h3>
                        <div
                          className={styles.PostContent}
                          dangerouslySetInnerHTML={{
                            __html: child.content.rendered,
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, md: 4 }}>
                        <img
                          src={_mediaApi.findFeaturedMedia(child, "full")}
                          width={"100%"}
                        />
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
            <Container py={100} size={"xl"}>
              <h2>Recent literature reviews</h2>
              <TrendingCarrocel />
              <div className={styles.More}>
                {" "}
                <a href={`/literature-reviews`}>
                  More Literature Reviews{" "}
                  <Button p={8} radius={"md"} size={"sm"}>
                    <IconArrowRight size={19} stroke={1.5} />
                  </Button>
                </a>
              </div>
            </Container>

            <RelatedVideosSection />
          </div>
        </>
      ) : (
        <LoadingOverlay visible={true} />
      )}
    </>
  );
}
