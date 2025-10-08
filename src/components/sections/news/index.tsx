import { Button, Container, Flex } from "@mantine/core";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useCallback, useContext, useEffect, useState } from "react";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { ResourceCard } from "@/components/feed/resourceitem";
import moment from "moment";
import styles from "../../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

export interface NewsSectionProps {
  region?: string;
  title?: string;
  posType?: string;
  archive?: string;
  includeDemo?: boolean;
  excludedTagIds?: number[];
}
export const NewsSection = ({
  region,
  title,
  posType,
  archive,
  includeDemo,
  excludedTagIds,
}: NewsSectionProps) => {
  const [posts, setPosts] = useState<Array<Post>>([]);
  const [demoTagId, setDemoTagId] = useState<number>();
  const _api = new PostsApi();
  const getNews = useCallback(async () => {
    try {
      const demoTag = await _api.getTagBySlug("demo");
      if (posType) {
        setDemoTagId(demoTag ? demoTag[0].id : undefined);
        
        // Preparar opções de exclusão de tags
        let tagOptions: any = {};
        
        // Se includeDemo for false, excluir tag demo
        if (includeDemo !== true && demoTag && demoTag[0]) {
          tagOptions.tagId = demoTag[0].id;
          tagOptions.excludeTag = true;
        }
        
        // Se excludedTagIds for fornecido, adicionar essas tags à exclusão
        if (excludedTagIds && excludedTagIds.length > 0) {
          if (tagOptions.tagId) {
            // Se já temos uma tag para excluir, combinar com as novas
            const existingTagId = Array.isArray(tagOptions.tagId) ? tagOptions.tagId : [tagOptions.tagId];
            tagOptions.tagId = [...existingTagId, ...excludedTagIds];
          } else {
            // Se não temos tags para excluir ainda, usar apenas as fornecidas
            tagOptions.tagId = excludedTagIds;
            tagOptions.excludeTag = true;
          }
        }
        
        
        const resp = await _api.getCustomPost(
          posType,
          4,
          undefined,
          undefined,
          region,
          Object.keys(tagOptions).length > 0 ? tagOptions : undefined
        );
        setPosts(resp.reverse());
      } else {
        const cat = await _api.getCategoryBySlug("thematic-page");
        
        // Preparar opções de exclusão de tags para posts normais
        let tagOptions: any = {};
        if (excludedTagIds && excludedTagIds.length > 0) {
          tagOptions.tagId = excludedTagIds;
          tagOptions.excludeTag = true;
        }
        
        
        const resp = await _api.getCustomPost(
          "posts",
          4,
          -1,
          undefined,
          region,
          cat
            ? {
                catId: cat.id,
                excludeCat: true,
                ...(Object.keys(tagOptions).length > 0 ? tagOptions : {}),
              }
            : Object.keys(tagOptions).length > 0 ? tagOptions : undefined
        );
        setPosts(resp);
      }
    } catch (error: any) {
    }
  }, [excludedTagIds]);
  useEffect(() => {
    getNews();
  }, [getNews]);

  function hasDemoTag(item: any, demoTagId: number): boolean {
    if (Array.isArray(item?.tags) && item.tags.includes(demoTagId)) {
      return true;
    }

    // CPTs (tags vêm via _embedded["wp:term"])
    const groups = item?._embedded?.["wp:term"] ?? [];
    const flat = typeof groups?.flat === "function" ? groups.flat() : groups;

    return (Array.isArray(flat) ? flat : []).some(
      (t: any) => t?.taxonomy === "post_tag" && t?.id === demoTagId
    );
  }

  return (
    <>
      {posts.length > 0 ? (
        <Container size={"xl"} py={80}>
          {title && posts.length > 0 ? (
            <>
              <h2 className={styles.TitleWithIcon}>{title}</h2>
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
                    <ResourceCard
                      demo={
                        demoTagId
                          ? hasDemoTag(item, demoTagId)
                            ? true
                            : false
                          : false
                      }
                      displayType="column"
                      key={key}
                      link={`/${archive ? archive : "news"}/${item.slug}`}
                      title={
                        removeHTMLTagsAndLimit(item.title.rendered, 65) +
                        `${item.title.rendered.length > 65 ? "..." : ""}`
                      }
                      type={moment(item.date).format("DD MMM , YYYY")}
                      image={_api.findFeaturedMedia(item, "full") ? _api.findFeaturedMedia(item, "full") : "/public/local/png/defaultImage.png"}
                      tags={_api.getPostTags(item).map((t) => {
                        return {
                          name:
                            removeHTMLTagsAndLimit(t, 20) +
                            `${t.length > 20 ? "..." : ""}`,
                          type: "descriptor",
                        };
                      })}
                      excerpt={
                        item.excerpt
                          ? removeHTMLTagsAndLimit(
                              decodeHtmlEntities(item.excerpt.rendered),
                              100
                            ) +
                            `${item.excerpt.rendered.length > 100 ? "..." : ""}`
                          : item.acf?.content
                          ? removeHTMLTagsAndLimit(
                              decodeHtmlEntities(item.acf.content),
                              100
                            ) + `${item.acf.content.length > 100 ? "..." : ""}`
                          : "--"
                      }
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
                href={!archive ? "/news" : "/" + archive}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "18px",
                }}
              >
                <Flex justify={"flex-start"} align={"center"} gap={10}>
                  {posType ? <p>Explore more</p> : <p>Explore archived news</p>}

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
