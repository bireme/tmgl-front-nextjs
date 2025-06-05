import { Button, Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { FiltersForm, TrendingTopicsFiltersForm } from "../forms/filters";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useContext, useEffect, useState } from "react";

import { ArticleDTO } from "@/services/types/rssFeedTypes";
import { DireveService } from "@/services/apiRepositories/DireveService";
import { EventsItemsDto } from "@/services/types/eventsDto";
import { FetchRSSFeed } from "@/services/rss/RssService";
import { GlobalContext } from "@/contexts/globalContext";
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
  const {} = useContext(GlobalContext);
  const _api = new PostsApi();

  const getPosts = async (regions?: number[]) => {
    if (regions) setRegionsFilter(regions);
    const data = await _api.getCustomPost(
      postType == "news" ? "posts" : postType,
      9,
      0,
      regionsFilter
    );
    setPosts(data);
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
                    href={
                      post.acf?.external_link
                        ? post.acf.external_link
                        : `/${postType.replace("_", "-")}/${post.slug}`
                    }
                    thumbnail={_api.findFeaturedMedia(post, "medium")}
                    tags={_api.getPostTags(post)}
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

export const TrendingTopicsFeedSection = ({ filter }: { filter?: string }) => {
  const [posts, setPosts] = useState<ArticleDTO[]>([]);
  const [queryString, setQueryString] = useState<string>("");
  const { globalConfig } = useContext(GlobalContext);
  const [count, setCount] = useState<number>(9);
  const getPosts = async (qs?: string, ct?: number) => {
    console.log(filter);
    try {
      const data = await FetchRSSFeed(
        0,
        ct ? ct : count,
        1,
        qs,
        filter ? filter : globalConfig?.acf.filter_rss
      );
      setPosts(data);
    } catch {
      console.log(
        "Error while trying to get Recent Literature Review from RSS"
      );
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
            <>
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
              <Center>
                <Button
                  mt={60}
                  onClick={() => {
                    getPosts(queryString, count + 9);
                    setCount(count + 9);
                  }}
                >
                  Load more
                </Button>
              </Center>
            </>
          ) : (
            <LoadingOverlay visible={true} />
          )}
        </Grid.Col>
      </Grid>
    </div>
  );
};
