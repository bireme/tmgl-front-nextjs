import { Container, LoadingOverlay } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { HeroHeader } from "@/components/sections/hero";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { useRouter } from "next/router";

export default function FeaturedStories() {
  const _api = new PostsApi();
  const [post, setPost] = useState<Post>();
  const router = useRouter();
  const {
    query: { slug },
  } = router;

  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("featured_stories", slug);
      setPost(resp[0]);
    } catch {
      console.log("Error while trying to get featured_stories");
      router.push("/404");
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
            path={["HOME", "Featured Stories"]}
            type="Featured Stories"
          />
        </>
      ) : (
        <>
          <LoadingOverlay visible={true} />
        </>
      )}
      <Container size={"xl"} py={60}></Container>
    </>
  );
}
