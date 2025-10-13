import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
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

export const NewsFeed = ({
  displayType,
  country,
  region,
  thematicArea,
}: {
  displayType: string;
  country?: string;
  region?: string;
  thematicArea?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const count = 12;
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<Post[]>([]);
  const [apiResponse, setApiResponse] = useState<ListPostsDto>();
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);
  const _api = new PostsApi();

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(0);
  };
  
  const getPosts = async () => {
    setLoading(true);
    const response = await _api.listPosts(
      "posts",
      count,
      page + 1, // API espera 1-based, mas mantemos 0-based internamente
      filter && filter.length > 0 ? filter : undefined
    );
    setTotalPages(Math.max(1, Math.ceil(response.totalItems / count)));
    setApiResponse(response);
    setItems(response.data);
    setLoading(false);
  };

  // Função específica para inicializar filtros de posts do WordPress
  const initialWordPressFilters = async () => {
    if (!(country || region || thematicArea) || initialFilterDone) {
      return;
    }

    setLoading(true);
    const filters: queryType[] = [];

    // Converter thematicArea slug para ID se necessário
    if (thematicArea) {
      try {
        const tags = await _api.getTagBySlug(thematicArea);
        if (tags && tags.length > 0) {
          filters.push({
            parameter: "tags",
            query: tags[0].id.toString(),
          });
        }
      } catch (error) {
        console.error("Error fetching tag by slug:", error);
      }
    }

    // Para country e region, vamos usar os valores diretos por enquanto
    // (pode precisar de conversão similar se necessário)
    if (country) {
      filters.push({
        parameter: "country",
        query: country,
      });
    }

    if (region) {
      filters.push({
        parameter: "region", 
        query: region,
      });
    }

    // Aplicar filtros se existirem
    if (filters.length > 0) {
      applyFilters(filters);
    }

    setLoading(false);
    setInitialFilterDone(true);
  };

  // Effect para aplicar filtros iniciais da URL
  useEffect(() => {
    initialWordPressFilters();
  }, [country, region, thematicArea, initialFilterDone]);

  // Effect para buscar dados quando filtros ou página mudam
  useEffect(() => {
    // Só busca dados se os filtros iniciais já foram aplicados ou se não há parâmetros da URL
    if (initialFilterDone || (!country && !region && !thematicArea)) {
      getPosts();
    }
  }, [page, filter, initialFilterDone]);

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
                    ? apiResponse?.regions
                        .filter(
                          (c, index, arr) =>
                            arr.findIndex((item) => item.name === c.name) ===
                            index
                        )
                        .map((c) => ({
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
                    ? Array.from(
                        new Map(
                          apiResponse?.countries.map((c) => [
                            c.name, // chave para garantir unicidade
                            {
                              label: c.name,
                              ocorrences: undefined,
                              id: c.id.toString(),
                            },
                          ])
                        ).values()
                      )
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
          {apiResponse ? (
            <Title order={4} mb={30} fw={400}>
              Showing {items.length} of {apiResponse?.totalItems} results found
            </Title>
          ) : (
            <></>
          )}
          <div 
            className={`${styles.ResourcesGrid} ${displayType === "column" ? styles.columnMode : styles.rowMode}`}
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
                      className={styles.GridMode}
                    />
                  );
                })}
              </>
            ) : loading ? (
              <></>
            ) : (
              <div
                style={{ 
                  height: "400px", 
                  width: "100%", 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  gridColumn: "1 / -1"
                }}
              >
                {apiResponse?.totalItems == 0 ? (
                  <Center>No results found!</Center>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
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
