import {} from "@/services/types/regulationsAndPolices";

import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import { DefaultFeedFilterComponent, ResourceFilters } from "../filters";
import {
  DefaultResourceDto,
  DefaultResourceItemDto,
} from "@/services/types/defaultResource";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { Pagination } from "../pagination";
import { RegulationsAndPolicesService } from "@/services/apiRepositories/RegulationAndPolices";
import { ResourceCard } from "../resourceitem";
import { initialFilters } from "../utils";
import { queryType } from "@/services/types/resources";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export const RegulationsAndPolicesFeed = ({
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
  const { globalConfig, language } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const _service = new RegulationsAndPolicesService();
  const count = 12;
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<DefaultResourceItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<DefaultResourceDto>();
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(0);
  };
  const getRegulationsAndPolicies = async () => {
    setLoading(true);
    try {
      const response = await _service.getResources(
        count,
        page * count,
        language,
        filter && filter.length > 0 ? filter : undefined
      );

      setTotalPages(Math.ceil(response.totalFound / count));
      setItems(response.data);
      setApiResponse(response);
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
      console.log("Error while fetching Legislations");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (globalConfig) getRegulationsAndPolicies();
  }, [page, filter, thematicArea, region, country, globalConfig]);

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
              Showing {count} of {apiResponse?.totalFound} results found
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
                      displayType={displayType}
                      key={k}
                      title={
                        removeHTMLTagsAndLimit(i.title, 120) +
                        `${i.title.length > 120 ? "..." : ""}`
                      }
                      excerpt={
                        removeHTMLTagsAndLimit(i.excerpt, 180) +
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
                              .filter((tag) => tag.trim() !== "") // Remove strings vazias ou com apenas espaços
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
