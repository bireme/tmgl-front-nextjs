import { Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  EvidenceMapItemDto,
  EvidenceMapsServiceDto,
} from "@/services/types/evidenceMapsDto";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { Pagination } from "../pagination";
import { RepositorieService } from "@/services/apiRepositories/RepositoriesServices";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { groupOccurrencesByRegion } from "../utils";
import { queryType } from "@/services/types/resources";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export const RepositoriesFeed = ({
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
  const _service = new RepositorieService();
  const count = 12;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<EvidenceMapItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<EvidenceMapsServiceDto>();
  const { language } = useContext(GlobalContext);
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);

  const initialFilters = (apiResponse: EvidenceMapsServiceDto) => {
    if (country) {
      const countryToFilter =
        apiResponse?.countryFilters?.filter((c) => c.lang === language) || [];
      let queryCountry = country;
      const matched = countryToFilter.find((c) =>
        c.queryString?.toLowerCase()?.includes(country)
      );
      queryCountry = matched?.queryString ?? country;
      console.log(countryToFilter);

      applyFilters([
        {
          parameter: "publication_country",
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
    getEvidencemaps();
  }, [country, region, thematicArea]);

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
      setTotalPages(response.totalFound / count);
      setItems(response.data);
      setApiResponse(response);
      if ((country || region || thematicArea) && !initialFilterDone) {
        initialFilters(response);
      }
    } catch (error) {
      console.log(error);
      console.log("Error while fetching Evidencemaps");
    }
    setLoading(false);
  };

  useEffect(() => {
    getEvidencemaps();
  }, [page, filter]);

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
                  queryType: "region",
                  label: "WHO Region",
                  items: groupOccurrencesByRegion(
                    apiResponse?.countryFilters
                      .filter((c) => c.lang == "en")
                      .map((c) => ({
                        label: c.type,
                        ocorrences: c.count,
                      }))
                  ),
                },
                {
                  queryType: "publication_country",
                  label: "Country",
                  items: apiResponse?.countryFilters
                    .filter((c) => c.lang == language)
                    .map((c) => ({
                      label: c.type,
                      ocorrences: c.count,
                      id: c.queryString,
                    })),
                },
                {
                  queryType: "descriptor",
                  label: "Thematic Area",
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
                      target="_blank"
                      displayType={displayType}
                      key={k}
                      title={i.title}
                      tags={_service.formatTags(i, language)}
                      excerpt={
                        removeHTMLTagsAndLimit(i.excerpt, 180) +
                        `${i.excerpt.length > 180 ? "..." : ""}`
                      }
                      link={i.links ? i.links[0] : ""}
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
