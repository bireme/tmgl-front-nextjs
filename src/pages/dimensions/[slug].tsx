import { Container, Grid, LoadingOverlay } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { HeroHeader } from "@/components/sections/hero";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../styles/pages/pages.module.scss";
import { useRouter } from "next/router";

export default function Dimensions() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;
  const [post, setPost] = useState<Post>();
  const _api = new PostsApi();

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
          <HeroHeader post={post} />
          <Container py={100} size={"xl"}>
            <Grid>
              <Grid.Col span={{ base: 12, md: 10 }}>
                <div
                  className={styles.PostContent}
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 2 }}></Grid.Col>
            </Grid>
          </Container>
        </>
      ) : (
        <LoadingOverlay visible={true} />
      )}
    </>
  );
}
