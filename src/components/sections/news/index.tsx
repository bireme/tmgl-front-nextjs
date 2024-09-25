import { Badge, Flex, LoadingOverlay } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import moment from "moment";
import styles from "../../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

export interface NewsItemProps {
  imagePath: string;
  date: Date;
  title: string;
  href: string;
  category?: string;
}
export const NewsItem = ({
  imagePath,
  date,
  title,
  href,
  category,
}: NewsItemProps) => {
  const router = useRouter();
  return (
    <Flex
      onClick={() => router.push(href)}
      className={styles.NewsItem}
      direction={"column"}
      justify={"start"}
    >
      <div
        className={styles.NewsImage}
        style={{ backgroundImage: `url(${imagePath})` }}
      ></div>
      <Flex
        direction={"column"}
        justify={"space-between"}
        className={styles.NewsContent}
      >
        <div>
          <p>
            <small>{moment(date).format("DD MMM [,] YYYY")}</small>
          </p>
          <h3>{title}</h3>
        </div>
        <Badge color={"tmgl-red"} style={{ fontWeight: 400 }} px={15} py={10}>
          {category}
        </Badge>
      </Flex>
    </Flex>
  );
};

export const NewsSection = () => {
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
    <>
      <Flex
        gap={30}
        direction={{ base: "column", md: "row" }}
        justify={"center"}
        align={"center"}
      >
        {posts ? (
          posts.length >= 4 ? (
            <>
              {posts.map((item, key) => {
                return (
                  <NewsItem
                    key={key}
                    href={`/news/${item.slug}`}
                    title={item.title.rendered}
                    date={moment(item.date).toDate()}
                    imagePath={_api.findFeaturedMedia(item, "full")}
                    category={_api.getPostCategories(item)[0]}
                  />
                );
              })}
            </>
          ) : (
            <LoadingOverlay visible={true} />
          )
        ) : (
          <LoadingOverlay visible={true} />
        )}
      </Flex>
    </>
  );
};
