import { Container, Grid, LoadingOverlay } from "@mantine/core";
import {
  RecomendedArticlesSection,
  RelatedArticlesSection,
} from "@/components/sections/recomended";
import { useCallback, useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { HeroHeader } from "@/components/sections/hero";
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
  const _api = new PostsApi();

  const { globalConfig } = useContext(GlobalContext);

  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("dimensions", slug);

      setPost(resp[0]);
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
          <Container py={100} size={"xl"}>
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }} p={40}>
                <div
                  className={styles.PostContent}
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }} p={40}>
                <h3 className={styles.PostPageSubtitle}>
                  {globalConfig?.acf.aside_tab_title}
                </h3>
                <RelatedArticlesSection
                  postTypeSlug="dimensions"
                  limit={4}
                  parent={post.id}
                />
              </Grid.Col>
            </Grid>
          </Container>
          <RelatedVideosSection />
          <RecomendedArticlesSection limit={3} />
        </>
      ) : (
        <LoadingOverlay visible={true} />
      )}
    </>
  );
}
