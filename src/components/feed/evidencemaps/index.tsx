import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import {
  EvidenceMapItemDto,
  EvidenceMapsServiceDto,
} from "@/services/types/evidenceMapsDto";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useContext, useEffect, useState } from "react";

import { EvidenceMapsService } from "@/services/apiRepositories/EvidenceMapsService";
import { GlobalContext } from "@/contexts/globalContext";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { chunkArray } from "@/components/layout/helper";
import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";

export const EvidenceMapsFeed = ({
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
  const _service = new EvidenceMapsService();
  const count = 12;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<EvidenceMapItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<EvidenceMapsServiceDto>();
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);
  const [priorityItems, setPriorityItems] = useState<EvidenceMapItemDto[]>([]);
  const { language } = useContext(GlobalContext);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };
  const getEvidencemaps = async () => {
    setLoading(true);
    try {
      const response = await _service.getResources(
        count + 1,
        (page - 1) * count,
        filter && filter.length > 0 ? filter : undefined
      );

      setTotalPages(Math.ceil(response.totalFound / count));
      setItems(response.data);
      setApiResponse(response);
      const priority = globalConfig?.acf.evidence_maps_priority;
      let priorityResult;
      let orderedItems;

      if (!filter || filter.length === 0) {
        if (page === 1 && priority != null && priority.length > 0) {
          let q: queryType = {
            parameter: "django_id",
            query: priority.join(","),
          };
          priorityResult = await _service.getResources(
            priority.length + 1,
            0,
            [q],
            true
          );
          const idPosition = new Map(priority.map((id, index) => [id, index]));
          orderedItems = priorityResult.data.sort(
            (a, b) =>
              (idPosition.get(a.id) ?? Infinity) -
              (idPosition.get(b.id) ?? Infinity)
          );
          setPriorityItems(orderedItems);
        }

        if (orderedItems || priorityItems.length > 0) {
          let inOrderItems =
            priorityItems.length > 0 ? priorityItems : orderedItems;
          let chunkedItems = chunkArray(
            inOrderItems as EvidenceMapItemDto[],
            count + 1
          );
          let auxOriginalItems = response.data;
          // Remove duplicados (que já estão na prioridade daquela página)
          const priorityIdsSet = new Set(inOrderItems?.map((item) => item.id));
          auxOriginalItems = auxOriginalItems.filter(
            (item) => !priorityIdsSet.has(item.id)
          );
          inOrderItems = chunkedItems[page - 1];

          // Junta os itens priorizados primeiro e os restantes da API depois
          const finalItems = [...inOrderItems, ...auxOriginalItems].slice(
            0,
            count
          ); // Garante o limite

          setItems(finalItems);
        }
      }

      if ((country || region || thematicArea) && !initialFilterDone) {
        initialFilters(response);
      }
    } catch (error) {
      console.log(error);
      console.log("Error while fetching Evidencemaps");
    }
    setLoading(false);
  };

  const initialFilters = (apiResponse: EvidenceMapsServiceDto) => {
    if (country) {
      const countryToFilter =
        apiResponse?.countryFilters?.filter((c) => c.lang === language) || [];
      let queryCountry = country;
      const matched = countryToFilter.find((c) =>
        c.queryString?.toLowerCase()?.includes(country)
      );
      queryCountry = matched?.queryString ?? country;

      applyFilters([
        {
          parameter: "country",
          query: queryCountry,
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

  useEffect(() => {
    if (globalConfig) getEvidencemaps();
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
                  queryType: "descriptor",
                  label: "Thematic area",
                  items: apiResponse?.thematicAreaFilters.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                  })),
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
                      title={decodeHtmlEntities(i.title)}
                      tags={_service.formatTags(i, language)}
                      image={i.image ? i.image : ""}
                      excerpt={
                        removeHTMLTagsAndLimit(i.excerpt, 180) +
                        `${i.excerpt.length > 180 ? "..." : ""}`
                      }
                      link={`/evidence-maps/${i.id}`}
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
