import {
  ACFMultimediaItem,
  Post,
  SimilarTheme,
  ThematicPageAcfProps,
} from "@/services/types/posts.dto";
import { Container, LoadingOverlay } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { PostsApi } from "@/services/posts/PostsApi";
import { StoriesSection } from "@/components/sections/stories";
import { TrendingCarrocel } from "@/components/rss/slider";
import {
  HeroSection,
  ContentSection,
  ResourcesSection,
  NewsEventsSection,
  MultimediaSection,
} from "@/components/sections";
import { useRouter } from "next/router";

export default function ThematicPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<ThematicPageAcfProps>();
  const [postProps, setPostProps] = useState<Post>();
  const [news, setNews] = useState<Array<Post>>([]);
  const [events, setEvents] = useState<Array<Post>>([]);
  const [thematicPageTag, setThematicPageTag] = useState();
  const [newsTag, setNewsTag] = useState();
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
        const thematicPageTagResp = await _api.getTagBySlug("thematic-page");
        setThematicPageTag(thematicPageTagResp[0]?.id);
        setNewsTag(tag[0]?.id);
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
          const eventsResponse = await _api.getCustomPost(
            "event",
            4,
            undefined,
            undefined,
            undefined,
            { tagId: [tagId], excludeTag: false }
          );
          setEvents(eventsResponse);
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
          <HeroSection
            sliderImages={properties?.search.slider_images}
            breadcrumbs={[
              {
                path: `/home`,
                name: "Home",
              },
              {
                path: `/thematic-page/${slug}`,
                name: slug ? slug.toString() : "",
              },
            ]}
            searchTitle={properties?.search.title || ""}
            searchSubtitle={properties?.search.subtitle || ""}
            small={true}
            blackColor={false}
          />

          <ContentSection
            title={postProps.title.rendered}
            content={properties?.content || ""}
            communityInitiatives={properties?.community_iniciatives}
            communityInitiativesTitle={properties?.comunity_initiatives_title}
          />

          <ResourcesSection
            similarThemes={properties?.similar_themes}
            similarThemesTitle={properties?.similar_themes_title}
            resources={properties?.resources}
            resourcesTitle={properties?.resources_title}
          />

          <TrendingCarrocel
            title={
              properties?.recent_literature_reviews_title
                ? properties?.recent_literature_reviews_title
                : "Recent literature reviews"
            }
            allFilter={properties?.rss_filter}
            rssString={
              properties?.rss_filter ? properties?.rss_filter : undefined
            }
          />

          <NewsEventsSection
            news={news}
            events={events}
            newsTitle={properties?.news_title}
            otherNewsTitle={properties?.other_news_title}
            eventsTitle={properties?.events_title}
            otherEventsTitle={properties?.other_events_title}
            showMoreNewsLink={properties?.show_more_news_link}
            showMoreEventsLink={properties?.show_more_news_link}
            exploreAllLabel={properties?.explore_all_label}
          />

          {thematicPageTag ? (
            <Container size={"xl"}>
              <StoriesSection />
            </Container>
          ) : null}

          <MultimediaSection
            multimediaItems={properties?.multimedia_items}
            relatedVideoTitle={properties?.releated_video_title}
            moreMediaUrl={properties?.more_media_url}
            exploreAllLabel={properties?.explore_all_label}
          />
        </>
      ) : (
        <div style={{ height: "100vh" }}>
          <LoadingOverlay visible={true} />
        </div>
      )}
    </>
  );
}
