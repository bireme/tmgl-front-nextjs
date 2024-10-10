import { Button, Container, Flex } from "@mantine/core";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useCallback, useEffect, useState } from "react";

import { IconArrowRight } from "@tabler/icons-react";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../../styles/components/sections.module.scss";

export interface ArticleItemProps {
  excerpt: string;
  title: string;
  href: string;
}

export const ArticleItem = ({ excerpt, title, href }: ArticleItemProps) => {
  return (
    <div className={styles.ArticleItem}>
      <h3>{title}</h3>
      <p>{excerpt}</p>
      <Button size={"xs"}>
        <a href={href}>
          <IconArrowRight stroke={1} />
        </a>
      </Button>
    </div>
  );
};

export const RelatedArticleItem = ({
  excerpt,
  title,
  href,
}: ArticleItemProps) => {
  return (
    <div className={styles.RelatedArticleItem}>
      <div>
        <h3>{title}</h3>
        <p>{excerpt}</p>
      </div>

      <Button size={"xs"}>
        <a href={href}>
          <IconArrowRight stroke={1} />
        </a>
      </Button>
    </div>
  );
};

export interface RecomendedArticlesSectionProps {
  limit: number;
  postTypeSlug?: string;
  tags?: Array<string>;
  parent?: number;
}
export const RecomendedArticlesSection = ({
  limit,
  postTypeSlug,
  parent,
  tags,
}: RecomendedArticlesSectionProps) => {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const _api = new PostsApi();
  const getArticles = useCallback(async () => {
    try {
      let posttype = postTypeSlug ? postTypeSlug : "posts";
      console.log(postTypeSlug);
      const resp = await _api.getCustomPost(
        posttype,
        limit,
        parent ? parent : undefined
      );
      setPosts(resp);
    } catch (error: any) {
      console.log("Error while getting Articles", error);
    }
  }, []);

  useEffect(() => {
    getArticles();
  }, [getArticles]);

  return (
    <div className={styles.RecomendedArticlesSection}>
      <Container size={"xl"}>
        <h2>Recommended articles</h2>
        <Flex gap={20} direction={{ base: "column", md: "row" }}>
          {posts?.map((item, key) => {
            return (
              <ArticleItem
                title={item.title.rendered}
                key={key}
                excerpt={
                  removeHTMLTagsAndLimit(
                    decodeHtmlEntities(item.excerpt.rendered),
                    120
                  ) + "..."
                }
                href={`/news/${item.slug}`}
              />
            );
          })}
        </Flex>
      </Container>
    </div>
  );
};

export const RelatedArticlesSection = ({
  limit,
  postTypeSlug,
  parent,
  tags,
}: RecomendedArticlesSectionProps) => {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const _api = new PostsApi();
  const getArticles = useCallback(async () => {
    try {
      let posttype = postTypeSlug ? postTypeSlug : "posts";
      console.log(postTypeSlug);
      const resp = await _api.getCustomPost(
        posttype,
        limit,
        parent ? parent : undefined
      );
      setPosts(resp);
    } catch (error: any) {
      console.log("Error while getting Articles", error);
    }
  }, []);

  useEffect(() => {
    getArticles();
  }, [getArticles]);
  return (
    <Flex gap={40} direction={"column"} px={20}>
      {posts?.map((item, key) => {
        return (
          <RelatedArticleItem
            title={decodeHtmlEntities(item.title.rendered)}
            key={key}
            excerpt={
              removeHTMLTagsAndLimit(
                decodeHtmlEntities(item.excerpt.rendered),
                120
              ) + "..."
            }
            href={`/${postTypeSlug ? postTypeSlug : "news"}/${item.slug}`}
          />
        );
      })}
    </Flex>
  );
};
