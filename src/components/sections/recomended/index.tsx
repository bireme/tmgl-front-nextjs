import { Button, Container, Flex } from "@mantine/core";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useCallback, useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
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
      <Button size={"xs"} component="a" href={href}>
        <IconArrowRight color="white" stroke={1} />
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

      <Button size={"xs"} component="a" href={href}>
        <IconArrowRight stroke={1} />
      </Button>
    </div>
  );
};

export interface RecomendedArticlesSectionProps {
  limit: number;
  postTypeSlug?: string;
  tags?: Array<string>;
  parent?: number;
  region?: string;
  callBack?: Function;
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
      const resp = await _api.getCustomPost(
        posttype,
        limit,
        parent ? parent : undefined
      );
      setPosts(resp);
    } catch (error: any) {
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
  region,
  callBack,
}: RecomendedArticlesSectionProps) => {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const _api = new PostsApi(region ? region : undefined);
  const getArticles = useCallback(async () => {
    try {
      let posttype = postTypeSlug ? postTypeSlug : "posts";
      const resp = await _api.getCustomPost(
        posttype,
        limit,
        parent ? parent : undefined
      );
      setPosts(resp);
      if (callBack) {
        callBack(resp.length);
      }
    } catch (error: any) {
    }
  }, []);

  useEffect(() => {
    getArticles();
  }, [getArticles]);
  return (
    <Flex gap={40} direction={"column"} px={0}>
      {posts?.map((item, key) => {
        const posttypeRouter =
          postTypeSlug == "page" || postTypeSlug == "pages"
            ? "content"
            : postTypeSlug;

        const href = item.acf?.external_link
          ? item.acf.external_link
          : `${region ? "/" + region : ""}/${
              posttypeRouter ? posttypeRouter : "news"
            }/${item.slug}`;
        return (
          <div key={key} className={styles.RelatedArticleLinkBox}>
            <a className={styles.RelatedArticleLink} href={`${href}`}>
              <h3>{decodeHtmlEntities(item.title.rendered)}</h3>
            </a>
          </div>
        );
      })}
    </Flex>
  );
};
