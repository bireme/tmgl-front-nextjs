import { Badge, Button, Container, Flex, LoadingOverlay } from "@mantine/core";
import { useCallback, useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
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
  category?: string[];
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
        <Flex gap={10}>
          {category?.map((item, key) => {
            return (
              <Badge
                key={key}
                color={"tmgl-red"}
                style={{ fontWeight: 400 }}
                px={15}
                py={10}
              >
                {item}
              </Badge>
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};

export interface NewsSectionProps {
  region?: string;
  title?: boolean;
}
export const NewsSection = ({ region, title }: NewsSectionProps) => {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const _api = new PostsApi();
  const getNews = useCallback(async () => {
    try {
      const resp = await _api.getCustomPost("posts", 4, -1, undefined, region);
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
      {posts.length > 0 ? (
        <Container size={"xl"} py={80}>
          {title && posts.length > 0 ? (
            <>
              <h2 className={styles.TitleWithIcon}>
                <img src={"/local/svg/simbol.svg"} /> News from WHO
              </h2>
            </>
          ) : (
            <></>
          )}
          {posts?.length > 0 ? (
            <>
              <Flex
                mb={40}
                gap={30}
                direction={{ base: "column", md: "row" }}
                justify={"flex-start"}
                align={"center"}
              >
                {posts.map((item, key) => {
                  return (
                    <NewsItem
                      key={key}
                      href={`/news/${item.slug}`}
                      title={item.title.rendered}
                      date={moment(item.date).toDate()}
                      imagePath={_api.findFeaturedMedia(item, "full")}
                      category={_api.getPostTags(item)}
                    />
                  );
                })}
              </Flex>
            </>
          ) : (
            <></>
          )}
          {posts.length > 0 ? (
            <>
              <Link
                href={"/news"}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "18px",
                }}
              >
                <Flex justify={"flex-start"} align={"center"} gap={10}>
                  <p>Explore archived news</p>{" "}
                  <Button p={5} size={"xs"}>
                    <IconArrowRight />
                  </Button>
                </Flex>
              </Link>
            </>
          ) : (
            <></>
          )}
        </Container>
      ) : (
        <></>
      )}
    </>
  );
};
