import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import { DefaultFeedFilterComponent, ResourceFilters } from "../filters";
import {
  DefaultResourceDto,
  DefaultResourceItemDto,
} from "@/services/types/defaultResource";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { JournalsService } from "@/services/apiRepositories/JournalsService";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { get } from "http";
import { initialFilters } from "../utils";
import { queryType } from "@/services/types/resources";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export const JournalsFeed = ({
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
  const _service = new JournalsService();
  const count = 12;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [dataResp, setDataResp] = useState<DefaultResourceDto>();
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<DefaultResourceItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<DefaultResourceDto>();
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);
  const { language } = useContext(GlobalContext);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };

  useEffect(() => {
    getJournals();
  }, [country, region, thematicArea, page, filter]);

  const getJournals = async () => {
    setLoading(true);
    try {
      const response = await _service.getDefaultResources(
        count,
        (page - 1) * count,
        language,
        filter && filter.length > 0 ? filter : undefined,
        "TMGL"
      );
      setTotalPages(response.totalFound / count);
      setItems(response.data);
      setDataResp(response);
      if (!apiResponse) {
        setApiResponse(response);
      }
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
    } catch (error) {
      console.log("Error while fetching journals");
    }
    setLoading(false);
  };

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
              Showing {items.length} of {dataResp?.totalFound} results found
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
                      target="_self"
                      link={"/journals/" + i.id}
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
                {apiResponse?.totalFound == 0 ? (
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
