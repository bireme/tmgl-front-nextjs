import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import { DefaultFeedFilterComponent, ResourceFilters } from "../filters";
import {
  DefaultResourceDto,
  DefaultResourceItemDto,
} from "@/services/types/defaultResource";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { MultimediaService } from "@/services/apiRepositories/MultimediaService";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { initialFilters } from "../utils";
import { queryType } from "@/services/types/resources";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export const MultimediaFeed = ({
  displayType,
  country,
  region,
  thematicArea,
  mediaType,
}: {
  displayType: string;
  country?: string;
  region?: string;
  thematicArea?: string;
  mediaType?: string;
}) => {
  const { globalConfig } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const _service = new MultimediaService();
  const count = 12;
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<DefaultResourceItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<DefaultResourceDto>();
  const { language } = useContext(GlobalContext);
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<string>("AND");

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(0);
  };

  const getMedias = async () => {
    setLoading(true);
    try {
      const response = await _service.getDefaultResources(
        count,
        page * count,
        language,
        filter && filter.length > 0 ? filter : undefined,
        true
      );

      setTotalPages(Math.max(1, Math.ceil(response.totalFound / count)));
      setItems(response.data);
      setApiResponse(response);
      if (
        (country || region || thematicArea || mediaType) &&
        !initialFilterDone
      ) {
        initialFilters(
          applyFilters,
          setLoading,
          setInitialFilterDone,
          country,
          thematicArea,
          region,
          mediaType
        );
      }
    } catch (error) {
    }
    setLoading(false);
  };

  useEffect(() => {
    if (globalConfig) getMedias();
  }, [page, filter, thematicArea, region, country, globalConfig, mediaType]);

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
                      image={i.thumbnail}
                      displayType={displayType}
                      key={k}
                      type={i.documentType ? i.documentType : "Multimedia"}
                      title={
                        i.title
                          ? removeHTMLTagsAndLimit(i.title, 120) +
                            `${i.title.length > 120 ? "..." : ""}`
                          : ""
                      }
                      excerpt={
                        i.excerpt
                          ? removeHTMLTagsAndLimit(i.excerpt, 180) +
                            `${i.excerpt.length > 180 ? "..." : ""}`
                          : ""
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
