import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import {
  ListPostsDto,
  Post,
  ThematicPageAcfProps,
} from "@/services/types/posts.dto";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useEffect, useState } from "react";

import { Pagination } from "../pagination";
import { PostsApi } from "@/services/posts/PostsApi";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import moment from "moment";
import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";

export const ThematicPagesFeed = ({ displayType }: { displayType: string }) => {
  const [loading, setLoading] = useState(false);
  const count = 12;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [items, setItems] = useState<Post[]>([]);
  const [apiResponse, setApiResponse] = useState<ListPostsDto>();
  const _api = new PostsApi();

  const applyFilters = async (queryList?: queryType[]) => {
    getPosts(queryList, true);
  };
  const getPosts = async (filter?: queryType[], resetPage?: boolean) => {
    if (resetPage) setPage(1);

    setLoading(true);
    const response = await _api.listPosts(
      "thematic-pages",
      count,
      resetPage ? 1 : page,
      filter
    );
    setTotalPages(Math.ceil(response.totalItems / count));
    setApiResponse(response);
    setItems(response.data.reverse());
    setLoading(false);
  };

  function hasDemoTag(item: any): boolean {
    const groups = item?._embedded?.["wp:term"] ?? [];
    const flat = typeof groups?.flat === "function" ? groups.flat() : groups;

    return (Array.isArray(flat) ? flat : []).some(
      (t: any) => t?.taxonomy === "post_tag" && t?.name === "Under Development"
    );
  }

  useEffect(() => {
    getPosts();
  }, [page]);

  return (
    <>
      <LoadingOverlay visible={loading} style={{ position: "fixed" }} />
      <Grid>
        <Grid.Col span={{ md: 3, base: 12 }} order={{ base: 2, sm: 1 }}>
          {items ? (
            <ResourceFilters
              stringParameter="search"
              callBack={applyFilters}
              filters={[
                {
                  queryType: "tags",
                  label: "Thematic Area",
                  items: apiResponse
                    ? Array.from(
                        new Map(
                          apiResponse.data
                            .flatMap((c) =>
                              (c._embedded?.["wp:term"] ?? [])
                                .flat()
                                .filter(
                                  (term: any) =>
                                    term?.taxonomy === "thematic-area"
                                )
                                .map((t: any) => ({
                                  label: t.name,
                                  ocorrences: undefined,
                                  id: String(t.id),
                                }))
                            )
                            // cria [id, objeto] para deduplicar pelo id
                            .map((obj) => [obj.id, obj])
                        ).values()
                      )
                    : [],
                },
                // {
                //   queryType: "country",
                //   label: "Countries",
                //   items: apiResponse
                //     ? apiResponse?.countries.map((c) => ({
                //         label: c.name,
                //         ocorrences: undefined,
                //         id: c.id.toString(),
                //       }))
                //     : [],
                // },
                // {
                //   queryType: "tags",
                //   label: "Language",
                //   items: apiResponse?.langs
                //     ? apiResponse?.langs.map((c) => ({
                //         label: c.name,
                //         ocorrences: undefined,
                //         id: c.id.toString(),
                //       }))
                //     : [],
                // },
              ]}
            />
          ) : (
            <></>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, sm: 1 }}>
          {apiResponse ? (
            <Title order={4} mb={30} fw={400}>
              Showing {count} of {apiResponse?.totalItems} results found
            </Title>
          ) : (
            <></>
          )}

          <Flex
            direction={{
              base: displayType == "column" ? "column" : "row",
              md: "row",
            }}
            gap={30}
            wrap={"wrap"}
            justify={"flex-start"}
          >
            {items.length > 0 ? (
              <>
                {items.map((i, k) => {
                  const acf: ThematicPageAcfProps = i.acf;
                  const image = _api.findFeaturedMedia(i, "medium");
                  return (
                    <ResourceCard
                      demo={hasDemoTag(i)}
                      displayType={displayType}
                      key={k}
                      title={i.title.rendered}
                      tags={_api.formatTags(i)}
                      image={image ? image : "/public/local/png/defaultImage.png"}
                      excerpt={
                        removeHTMLTagsAndLimit(
                          decodeHtmlEntities(acf.content),
                          180
                        ) + `${acf.content.length > 180 ? "..." : ""}`
                      }
                      link={`/thematic-page/${i.slug}`}
                    />
                  );
                })}
              </>
            ) : loading ? (
              <></>
            ) : (
              <Flex
                style={{ height: "400px", width: "100%" }}
                justify={"center"}
                align={"center"}
              >
                {apiResponse?.totalItems == 0 ? (
                  <Center>No results found!</Center>
                ) : (
                  <></>
                )}
              </Flex>
            )}
          </Flex>
          <div className={styles.PaginationContainer}>
            <Pagination
              callBack={setPage}
              currentIndex={page}
              totalPages={totalPages}
            />
          </div>
        </Grid.Col>
      </Grid>
    </>
  );
};
