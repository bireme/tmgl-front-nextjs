import { Container, Flex } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { NewsItem } from "@/components/sections/news";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import moment from "moment";
import styles from "../../styles/pages/pages.module.scss";

export default function NewsList() {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const _api = new PostsApi();
  const getNews = useCallback(async () => {
    try {
      const resp = await _api.getCustomPost("posts", 4);
      setPosts(resp);
    } catch (error: any) {
      console.log("Error while getting news", error);
    }
  }, []);
  useEffect(() => {
    getNews();
  }, [getNews]);

  return (
    <Container size={"xl"} py={60}>
      <BreadCrumbs path={["HOME", "News"]} blackColor={true} />
      <h2 className={styles.TitleWithIcon}>News</h2>
      <Flex direction={"row"} gap={25} justify={"space-between"} wrap={"wrap"}>
        {posts.map((post, key) => {
          return (
            <NewsItem
              key={key}
              date={moment(post.date).toDate()}
              href={`/news/${post.slug}`}
              imagePath={_api.findFeaturedMedia(post, "thumbnail")}
              title={post.title.rendered}
              category={_api.getPostCategories(post)[0]}
            />
          );
        })}
      </Flex>
    </Container>
  );
}
