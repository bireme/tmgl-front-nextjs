import { FiltersForm, TrendingTopicsFiltersForm } from "../forms/filters";
import { Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useEffect, useState } from "react";

import { ArticleDTO } from "@/services/types/rssFeedTypes";
import { FetchRSSFeed } from "@/services/rss/RssService";
import { NewsItem } from "../sections/news";
import { Post } from "@/services/types/posts.dto";
import { PostItem } from "./post/postItem";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../styles/components/feed.module.scss";

export interface FeedSectionProps {
  postType: string;
}
export const FeedSection = ({ postType }: FeedSectionProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [regionsFilter, setRegionsFilter] = useState<number[]>([]);
  const _api = new PostsApi();

  const getPosts = async (regions?: number[]) => {
    if (regions) setRegionsFilter(regions);

    const data = await _api.getCustomPost(postType, 9, 0, regionsFilter);
    setPosts(data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={styles.FeedSection}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 2.5 }}>
          <FiltersForm onSubmit={() => getPosts()} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5 }} py={60} px={20}>
          {posts.length > 0 ? (
            <Flex
              direction={{ base: "column", md: "row" }}
              wrap={"wrap"}
              gap={30}
            >
              {posts.map((post, index) => {
                return (
                  <PostItem
                    title={decodeHtmlEntities(post.title.rendered)}
                    key={index}
                    excerpt={decodeHtmlEntities(
                      removeHTMLTagsAndLimit(post.excerpt.rendered, 120)
                    )}
                    href={`/${postType.replace("_", "-")}/${post.slug}`}
                    thumbnail={_api.findFeaturedMedia(post, "medium")}
                  />
                );
              })}
            </Flex>
          ) : (
            <LoadingOverlay visible={true} />
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
};

export const TrendingTopicsFeedSection = () => {
  const [posts, setPosts] = useState<ArticleDTO[]>([]);
  const [queryString, setQueryString] = useState<string>("");
  const getPosts = async (qs?: string) => {
    try {
      const data = await FetchRSSFeed("en", 0, 10, 1, qs);
      setPosts(data);
    } catch {
      console.log("Error while trying to get Trending Topics from RSS");
    }
  };

  const applyQueryString = async (qs: string) => {
    setQueryString(qs);
    setPosts([]);
    await getPosts(qs);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={styles.FeedSection}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 2.5 }}>
          <TrendingTopicsFiltersForm
            queryString={queryString}
            setQueryString={applyQueryString}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5 }} py={60} px={20}>
          {posts.length > 0 ? (
            <Flex
              direction={{ base: "column", md: "row" }}
              wrap={"wrap"}
              gap={30}
            >
              {posts.map((post, index) => {
                return (
                  <PostItem
                    title={decodeHtmlEntities(post.title.trim())}
                    key={index}
                    excerpt={decodeHtmlEntities(
                      removeHTMLTagsAndLimit(post.description.trim(), 120)
                    )}
                    href={`${post.link}`}
                    thumbnail=""
                  />
                );
              })}
            </Flex>
          ) : (
            <LoadingOverlay visible={true} />
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
};
