import { Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { ListPostsDto, Post } from "@/services/types/posts.dto";
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

export const NewsFeed = ({ displayType }: { displayType: string }) => {
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
      "posts",
      count,
      resetPage ? 1 : page,
      filter
    );
    setTotalPages(response.totalItems / count);
    setApiResponse(response);
    setItems(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

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
                  queryType: "region",
                  label: "WHO Regions",
                  items: apiResponse
                    ? apiResponse?.regions.map((c) => ({
                        label: c.name,
                        ocorrences: undefined,
                        id: c.id.toString(),
                      }))
                    : [],
                },
                {
                  queryType: "country",
                  label: "Country",
                  items: apiResponse
                    ? apiResponse?.countries.map((c) => ({
                        label: c.name,
                        ocorrences: undefined,
                        id: c.id.toString(),
                      }))
                    : [],
                },
                {
                  queryType: "tags",
                  label: "Thematic Area",
                  items: apiResponse
                    ? apiResponse?.tags.map((c) => ({
                        label: c.name,
                        ocorrences: undefined,
                        id: c.id.toString(),
                      }))
                    : [],
                },
                {
                  queryType: "after",
                  label: "Publication Year",
                  items: apiResponse
                    ? Array.from(
                        new Map(
                          apiResponse.dates.map((c) => {
                            const label = c ? moment(c).format("YYYY") : "";
                            return [
                              label,
                              {
                                label,
                                ocorrences: undefined,
                                id: c
                                  ? `${moment(c).format(
                                      "YYYY"
                                    )}-01-01T00:00:00&before=${moment(c).format(
                                      "YYYY"
                                    )}-12-31T23:59:59`
                                  : "",
                              },
                            ];
                          })
                        ).values()
                      )
                    : [],
                },
              ]}
            />
          ) : (
            <></>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, sm: 1 }}>
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
                  return (
                    <ResourceCard
                      displayType={displayType}
                      key={k}
                      title={i.title.rendered}
                      tags={_api.formatTags(i)}
                      image={_api.findFeaturedMedia(i, "medium")}
                      excerpt={
                        removeHTMLTagsAndLimit(
                          decodeHtmlEntities(i.excerpt.rendered),
                          180
                        ) + `${i.excerpt.rendered.length > 180 ? "..." : ""}`
                      }
                      link={`/news/${i.slug}`}
                    />
                  );
                })}
              </>
            ) : (
              <Flex
                style={{ height: "400px", width: "100%" }}
                justify={"center"}
                align={"center"}
              >
                <Center>No results found!</Center>
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
