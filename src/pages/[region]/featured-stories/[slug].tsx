import {
  FirstSection,
  SecondSection,
  ThirdSection,
} from "@/components/sections/stories/page";
import { useCallback, useContext, useEffect, useState } from "react";

import { FeaturedStoriesAcf } from "@/services/types/featuredStoriesAcf";
import Head from "next/head";
import { HeroHeader } from "@/components/sections/hero";
import { LoadingOverlay } from "@mantine/core";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { useRouter } from "next/router";

export default function FeaturedStories() {
  
  const [post, setPost] = useState<Post>();
  const [acf, setAcf] = useState<FeaturedStoriesAcf>();
  const router = useRouter();
  
  const {
    query: { slug, region },
  } = router;

  const getPost = useCallback(async (slug: string, regionParam?: string) => {
    try {
      const _api = new PostsApi(regionParam ? regionParam.toString() : "");
      const resp = await _api.getPost("featured_stories", slug);

      setPost(resp[0]);
      setAcf(resp[0].acf);
    } catch {
      console.log("Post not found");
    }
  }, []);

  useEffect(() => {
    if (slug && router.isReady) {
      getPost(slug.toString(), region?.toString());
    }
  }, [getPost, slug, region, router.isReady]);

  return (
    <>
      <Head>
        <title>{post?.title.rendered ? `${post.title.rendered} - ` : ''}The WHO Traditional Medicine Global Library</title>
      </Head>
      {post ? (
        <>
          <HeroHeader
            post={post}
            path={[
              { path: "/", name: "HOME" },
              { path: "/featured-stories", name: "Featured stories" },
            ]}
            type="Featured stories"
          />
          {acf ? (
            <>
              {acf.first_session && acf.first_session.content ? (
                <FirstSection acf={acf} />
              ) : (
                <></>
              )}
              {acf.second_session && acf.second_session.content ? (
                <SecondSection acf={acf} />
              ) : (
                <></>
              )}
              {acf.third_session && acf.third_session.content ? (
                <ThirdSection acf={acf} />
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <LoadingOverlay visible={true} />
        </>
      )}
    </>
  );
}