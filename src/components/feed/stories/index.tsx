import { Center, Grid, LoadingOverlay, Title } from "@mantine/core";
import { ListPostsDto, Post } from "@/services/types/posts.dto";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useEffect, useState, useContext } from "react";

import { Pagination } from "../pagination";
import { PostsApi } from "@/services/posts/PostsApi";
import { ResourceCard } from "../resourceitem";
import { DefaultFeedFilterComponent } from "../filters";
import { GlobalContext } from "@/contexts/globalContext";
import { initialFilters } from "../utils";
import { queryType } from "@/services/types/resources";
import { applyDefaultResourceFilters } from "@/services/apiRepositories/utils";
import { DefaultResourceDto, DefaultResourceItemDto } from "@/services/types/defaultResource";
import styles from "../../../styles/components/resources.module.scss";

export const StoriesFeed = ({
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
  const [allItems, setAllItems] = useState<DefaultResourceItemDto[]>([]);
  const [filteredItems, setFilteredItems] = useState<DefaultResourceItemDto[]>([]);
  const [items, setItems] = useState<DefaultResourceItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<DefaultResourceDto>();
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);
  const { language } = useContext(GlobalContext);
  const _api = new PostsApi();

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(0);
  };

  // Converter Post para DefaultResourceItemDto
  const convertPostToResourceItem = (post: Post): DefaultResourceItemDto => {
    const country = post._embedded?.["wp:term"]?.flat()?.find(term => term.taxonomy === "country")?.name || "";
    const region = post._embedded?.["wp:term"]?.flat()?.find(term => term.taxonomy === "region")?.name || "";
    const thematicAreas = post._embedded?.["wp:term"]?.flat()?.filter(term => term.taxonomy === "post_tag").map(t => t.name) || [];

    return {
      id: post.id.toString(),
      title: decodeHtmlEntities(post.title.rendered),
      excerpt: decodeHtmlEntities(removeHTMLTagsAndLimit(post.excerpt.rendered, 180)),
      link: post.acf?.external_link || `/featured-stories/${post.slug}`,
      thumbnail: _api.findFeaturedMedia(post, "medium"),
      country: country,
      region: region,
      documentType: "Featured Story",
      resourceType: "Featured Story",
      year: new Date(post.date).getFullYear().toString(),
      thematicArea: thematicAreas,
      modality: undefined,
    };
  };

  // Gerar filtros a partir dos dados
  const generateFiltersFromData = (items: DefaultResourceItemDto[]): DefaultResourceDto => {
    const countries = [...new Set(items.map(item => item.country).filter(Boolean))] as string[];
    const regions = [...new Set(items.map(item => item.region).filter(Boolean))] as string[];
    const years = [...new Set(items.map(item => item.year).filter(Boolean))] as string[];
    
    const allThematicAreas = items.flatMap(item => 
      Array.isArray(item.thematicArea) ? item.thematicArea : [item.thematicArea]
    ).filter(Boolean) as string[];
    const uniqueThematicAreas = [...new Set(allThematicAreas)];

    return {
      data: items,
      totalFound: items.length,
      countryFilter: countries.map(country => ({ type: country, count: 0 })),
      regionFilter: regions.map(region => ({ type: region, count: 0 })),
      documentTypeFilter: [{ type: "Featured Story", count: items.length }],
      resourceTypeFilter: [],
      yearFilter: years.map(year => ({ type: year, count: 0 })),
      thematicAreaFilter: uniqueThematicAreas.map(area => ({ type: area, count: 0 })),
      eventFilter: [],
    };
  };

  // Buscar todos os posts
  const getAllPosts = async () => {
    setLoading(true);
    try {
      const response = await _api.listPosts("featured_stories", 100, 1); // Buscar muitos posts
      const convertedItems = response.data.map(convertPostToResourceItem);
      setAllItems(convertedItems);
      
      const mockApiResponse = generateFiltersFromData(convertedItems);
      setApiResponse(mockApiResponse);
    } catch (error) {
      console.error("Error fetching featured stories:", error);
    }
    setLoading(false);
  };

  // Aplicar filtros e paginação
  const applyFiltersAndPagination = () => {
    let filtered = allItems;

    // Aplicar filtros se existirem
    if (filter && filter.length > 0) {
      filtered = applyDefaultResourceFilters(filter, allItems);
    }

    setFilteredItems(filtered);

    // Aplicar paginação
    const start = page * count;
    const end = start + count;
    const paginated = filtered.slice(start, end);
    setItems(paginated);

    // Atualizar total de páginas
    setTotalPages(Math.max(1, Math.ceil(filtered.length / count)));
  };

  // Effect para buscar todos os posts
  useEffect(() => {
    getAllPosts();
  }, []);

  // Effect para aplicar filtros iniciais da URL
  useEffect(() => {
    if ((country || region || thematicArea) && !initialFilterDone) {
      initialFilters(
        applyFilters,
        setLoading,
        setInitialFilterDone,
        country,
        thematicArea,
        region
      );
    }
  }, [country, region, thematicArea, initialFilterDone]);

  // Effect para aplicar filtros e paginação quando necessário
  useEffect(() => {
    if (allItems.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allItems, filter, page]);

  return (
    <>
      <LoadingOverlay visible={loading} style={{ position: "fixed" }} />
      <Grid>
        <Grid.Col span={{ md: 3, base: 12 }} order={{ base: 2, sm: 1 }}>
          {apiResponse ? (
            <DefaultFeedFilterComponent
              applyFilters={applyFilters}
              apiResponse={apiResponse}
            />
          ) : (
            <></>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }} order={{ base: 2, sm: 1 }}>
          {apiResponse ? (
            <Title order={4} mb={30} fw={400}>
              Showing {items.length} of {filteredItems.length} results found
            </Title>
          ) : (
            <></>
          )}
          <div 
            className={`${styles.ResourcesGrid} ${displayType === "column" ? styles.columnMode : styles.rowMode}`}
          >
            {items.length > 0 ? (
              <>
                {items.map((item, k) => {
                  return (
                    <ResourceCard
                      image={item.thumbnail}
                      displayType={displayType}
                      key={k}
                      title={
                        item.title
                          ? removeHTMLTagsAndLimit(item.title, 120) +
                            `${item.title.length > 120 ? "..." : ""}`
                          : ""
                      }
                      excerpt={
                        item.excerpt
                          ? removeHTMLTagsAndLimit(item.excerpt, 180) +
                            `${item.excerpt.length > 180 ? "..." : ""}`
                          : ""
                      }
                      tags={[
                        ...(item.country
                          ? [
                              {
                                name: item.country,
                                type: "country",
                              },
                            ]
                          : []),
                        ...(item.region
                          ? [
                              {
                                name: item.region,
                                type: "region",
                              },
                            ]
                          : []),
                        ...(Array.isArray(item.thematicArea)
                          ? item.thematicArea
                              .filter((tag) => tag.trim() !== "")
                              .map((tag) => ({
                                name: tag,
                                type: "descriptor",
                              }))
                          : item.thematicArea
                          ? [
                              {
                                name: item.thematicArea,
                                type: "descriptor",
                              },
                            ]
                          : []),
                      ]}
                      target="_self"
                      link={item.link}
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
                {filteredItems.length == 0 ? (
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
