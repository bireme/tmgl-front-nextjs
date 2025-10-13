import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import { DefaultFeedFilterComponent, ResourceFilters } from "../filters";
import {
  DefaultResourceDto,
  DefaultResourceItemDto,
} from "@/services/types/defaultResource";
import { useContext, useEffect, useState } from "react";

import { DireveService } from "@/services/apiRepositories/DireveService";
import { GlobalContext } from "@/contexts/globalContext";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { initialFilters } from "../utils";
import { queryType } from "@/services/types/resources";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export const EventsFeed = ({
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
  const _service = new DireveService();
  const count = 12;
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<DefaultResourceItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<DefaultResourceDto>();
  const { language } = useContext(GlobalContext);
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(0);
  };
  const getEvents = async () => {
    setLoading(true);
    try {
      const response = await _service.getDefaultResources(
        count,
        page * count,
        language,
        filter && filter.length > 0 ? filter : undefined
      );
      setTotalPages(Math.max(1, Math.ceil(response.totalFound / count)));
      setItems(response.data);
      setApiResponse(response);
    } catch (error) {
    }
    setLoading(false);
  };

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

  // Effect para buscar dados quando filtros ou página mudam
  useEffect(() => {
    getEvents();
  }, [page, filter, thematicArea, region, country]);

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
              Showing {items.length} of {apiResponse?.totalFound} results found
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
                      title={
                        removeHTMLTagsAndLimit(i.title, 120) +
                        `${i.title.length > 120 ? "..." : ""}`
                      }
                      excerpt={
                        removeHTMLTagsAndLimit(i.excerpt, 180).replace(/<\/?[^>]+(>|$)/g, "").replace(/&nbsp;/g, " ") +
                        `${i.excerpt.length > 180 ? "..." : ""}`
                      }
                      tags={[
                        ...(i.country
                          ? [
                              {
                                name: i.country,
                                type: "country",
                              },
                            ]
                          : []),
                        ...(i.region
                          ? [
                              {
                                name: i.region,
                                type: "region",
                              },
                            ]
                          : []),
                        ...(Array.isArray(i.thematicArea)
                          ? i.thematicArea
                              .filter((tag) => tag.trim() !== "")
                              .map((tag) => ({
                                name: tag,
                                type: "descriptor",
                              }))
                          : i.thematicArea
                          ? [
                              {
                                name: i.thematicArea,
                                type: "descriptor",
                              },
                            ]
                          : []),
                      ]}
                      target="_blank"
                      type={i.documentType}
                      link={i.link}
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
                {apiResponse?.totalFound == 0 ? (
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
