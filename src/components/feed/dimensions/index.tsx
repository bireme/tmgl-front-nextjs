import { Flex, Grid, LoadingOverlay } from "@mantine/core";
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
import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";

export const DimensionsFeed = ({ displayType }: { displayType: string }) => {
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
      "dimensions",
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
              filters={[]}
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
                      link={`/dimensions/${i.slug}`}
                    />
                  );
                })}
              </>
            ) : (
              <></>
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
