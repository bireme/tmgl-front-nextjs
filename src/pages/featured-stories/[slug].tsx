import { Container, LoadingOverlay } from "@mantine/core";
import {
  EvidenceMapItem,
  EvidenceMapsSection,
} from "@/components/sections/evidence-maps";
import {
  FirstSection,
  SecondSection,
  ThirdSection,
} from "@/components/sections/stories/page";
import { useCallback, useContext, useEffect, useState } from "react";

import { FeaturedStoriesAcf } from "@/services/types/featuredStoriesAcf";
import { HeroHeader } from "@/components/sections/hero";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { useRouter } from "next/router";

export default function FeaturedStories() {
  const _api = new PostsApi();
  const [post, setPost] = useState<Post>();
  const [acf, setAcf] = useState<FeaturedStoriesAcf>();
  const router = useRouter();
  const {
    query: { slug },
  } = router;

  const getPost = useCallback(async (slug: string) => {
    try {
      const resp = await _api.getPost("featured_stories", slug);
      setPost(resp[0]);
      setAcf(resp[0].acf);
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
            path={[
              { path: "/", name: "HOME" },
              { path: "/featured-stories", name: "Featured Stories" },
            ]}
            type="Featured Stories"
          />
          {acf ? (
            <>
              {acf.first_session ? <FirstSection acf={acf} /> : <></>}
              {acf.second_session ? <SecondSection acf={acf} /> : <></>}
              {acf.third_session ? <ThirdSection acf={acf} /> : <></>}
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
