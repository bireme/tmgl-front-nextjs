import { Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  DefaultResourceDto,
  DefaultResourceItemDto,
} from "@/services/types/defaultResource";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { MultimediaService } from "@/services/apiRepositories/MultimediaService";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { queryType } from "@/services/types/resources";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export const MultimediaFeed = ({
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
  const { globalConfig } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const _service = new MultimediaService();
  const count = 11;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<DefaultResourceItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<DefaultResourceDto>();
  const { language } = useContext(GlobalContext);
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);

  const initialFilters = (apiResponse: DefaultResourceDto) => {
    if (country) {
      applyFilters([
        {
          parameter: "country",
          query: country,
        },
      ]);
    }
    if (region) {
      applyFilters([
        {
          parameter: "region",
          query: region,
        },
      ]);
    }
    if (thematicArea) {
      applyFilters([
        {
          parameter: "descriptor",
          query: thematicArea,
        },
      ]);
    }
    setLoading(false);
    setInitialFilterDone(true);
  };

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };

  const getMedias = async () => {
    setLoading(true);
    try {
      const response = await _service.getDefaultResources(
        count + 1,
        (page - 1) * count,
        language,
        filter && filter.length > 0 ? filter : undefined
      );

      setTotalPages(Math.ceil(response.totalFound / count));
      setItems(response.data);
      setApiResponse(response);
      if ((country || region || thematicArea) && !initialFilterDone) {
        initialFilters(response);
      }
    } catch (error) {
      console.log(error);
      console.log("Error while fetching Multimedias");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (globalConfig) getMedias();
  }, [page, filter, thematicArea, region, country, globalConfig]);

  return (
    <>
      <LoadingOverlay visible={loading} style={{ position: "fixed" }} />
      <Grid>
        <Grid.Col span={{ md: 3, base: 12 }} order={{ base: 2, sm: 1 }}>
          {apiResponse ? (
            <ResourceFilters
              callBack={applyFilters}
              filters={[
                {
                  queryType: "Region",
                  label: "WHO Regions",
                  items: apiResponse?.regionFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
                  })),
                },
                {
                  queryType: "country",
                  label: "Country",
                  items: apiResponse?.countryFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
                  })),
                },

                {
                  queryType: "descriptor",
                  label: "Thematic area",
                  items: apiResponse?.thematicAreaFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
                  })),
                },
                {
                  queryType: "publication_year",
                  label: "Year",
                  items: apiResponse?.yearFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
                  })),
                },
                {
                  queryType: "resource_type",
                  label: "Media Type",
                  items: apiResponse.resourceTypeFilter
                    ? apiResponse?.resourceTypeFilter.map((c) => ({
                        label: c.type,
                        ocorrences: c.count,
                        id: undefined,
                      }))
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
                      image={i.thumbnail}
                      displayType={displayType}
                      key={k}
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
                      type={i.documentType}
                      link={i.link}
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
