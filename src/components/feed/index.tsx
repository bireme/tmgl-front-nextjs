import { Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useEffect, useState } from "react";

import { FiltersForm } from "../forms/filters";
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
  const _api = new PostsApi();

  const getPosts = async () => {
    const data = await _api.getCustomPost(postType, 9, 0);
    setPosts(data);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={styles.FeedSection}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 2.5 }}>
          <FiltersForm />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9.5 }} py={60} px={20}>
          {posts.length > 0 ? (
            <Flex direction={"row"} wrap={"wrap"} gap={30}>
              {posts.map((post, index) => {
                console.log(_api.findFeaturedMedia(post, "thumbnail"));
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
