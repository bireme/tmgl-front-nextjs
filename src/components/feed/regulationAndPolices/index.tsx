import { Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  RegulationAndPolicesItemDto,
  RegulationsAndPolicesDto,
} from "@/services/types/regulationsAndPolices";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { Pagination } from "../pagination";
import { RegulationAndPolicesService } from "@/services/apiRepositories/RegulationAndPolices";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";

export const RegulationAndPolicesFeed = ({
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
  const _service = new RegulationAndPolicesService();
  const count = 11;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<RegulationAndPolicesItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<RegulationsAndPolicesDto>();

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };
  const getRegulationsAndPolicies = async () => {
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
    } catch (error) {
      console.log(error);
      console.log("Error while fetching Legislations");
    }
    setLoading(false);
  };

  //   if (country) {
  //     const countryToFilter =
  //       apiResponse?.act_country?.filter((c) => c.lang === language) || [];
  //     let queryCountry = country;
  //     const matched = countryToFilter.find((c) =>
  //       c.queryString?.toLowerCase()?.includes(country)
  //     );
  //     queryCountry = matched?.queryString ?? country;

  //     applyFilters([
  //       {
  //         parameter: "country",
  //         query: queryCountry,
  //       },
  //     ]);
  //   }
  //   if (region) {
  //     applyFilters([
  //       {
  //         parameter: "region",
  //         query: region,
  //       },
  //     ]);
  //   }
  //   if (thematicArea) {
  //     applyFilters([
  //       {
  //         parameter: "descriptor",
  //         query: thematicArea,
  //       },
  //     ]);
  //   }
  //   setLoading(false);
  //   setInitialFilterDone(true);
  // };

  useEffect(() => {
    if (globalConfig) getRegulationsAndPolicies();
    console.log("mudou de página", page);
  }, [page, filter, thematicArea, region, country, globalConfig]);

  return (
    <>
      <LoadingOverlay visible={loading} style={{ position: "fixed" }} />
      <Grid>
        <Grid.Col span={{ md: 3, base: 12 }} order={{ base: 2, sm: 1 }}>
          {apiResponse ? (
            <ResourceFilters callBack={applyFilters} filters={[]} />
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
                      title={
                        removeHTMLTagsAndLimit(i.title, 120) +
                        `${i.title.length > 120 ? "..." : ""}`
                      }
                      excerpt={
                        removeHTMLTagsAndLimit(i.official_ementa, 180) +
                        `${i.official_ementa.length > 180 ? "..." : ""}`
                      }
                      resourceType="regulations-and-policies"
                      target="_blank"
                      link={i.file}
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
