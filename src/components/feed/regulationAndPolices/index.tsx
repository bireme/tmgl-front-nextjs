import { Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  RegulationAndPolicesItemDto,
  RegulationsAndPolicesDto,
} from "@/services/types/regulationsAndPolices";
import {
  decodeHtmlEntities,
  getValueFromMultilangItem,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import moment, { lang } from "moment";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { Pagination } from "../pagination";
import { RegulationAndPolicesService } from "@/services/apiRepositories/RegulationAndPolices";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { parseMultLangStringAttr } from "@/services/apiRepositories/utils";
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
  const { globalConfig, language } = useContext(GlobalContext);
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
        100,
        100,
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
            <ResourceFilters
              callBack={applyFilters}
              filters={[
                {
                  queryType: "publication_country",
                  label: "Country",
                  items: apiResponse?.legislationFilters.country.map((c) => {
                    return {
                      id: c.type,
                      label: getValueFromMultilangItem(
                        language,
                        c.type
                          .split("|")
                          .map((i) => i.replace("^", "|"))
                          .map((i) => {
                            return {
                              lang: i.split("|")[0],
                              content: i.split("|")[1],
                            };
                          })
                      ),
                      ocorrences: c.count,
                    };
                  }),
                },
                {
                  queryType: "act_type",
                  label: "Type",
                  items: apiResponse?.legislationFilters.type.map((c) => {
                    return {
                      type: c.type,
                      label: getValueFromMultilangItem(
                        language,
                        c.type
                          .split("|")
                          .map((i) => i.replace("^", "|"))
                          .map((i) => {
                            return {
                              lang: i.split("|")[0],
                              content: i.split("|")[1],
                            };
                          })
                      ),
                      ocorrences: c.count,
                    };
                  }),
                },
                {
                  queryType: "publication_year",
                  label: "Year",
                  items: apiResponse?.legislationFilters.year
                    .map((c) => {
                      return {
                        id: c.type,
                        label: c.type,
                        ocorrences: c.count,
                      };
                    })
                    .sort((a, b) => parseInt(b.label) - parseInt(a.label)),
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
                      displayType={displayType}
                      key={k}
                      title={
                        removeHTMLTagsAndLimit(i.title, 120) +
                        `${i.title.length > 120 ? "..." : ""}`
                      }
                      excerpt={
                        removeHTMLTagsAndLimit(
                          getValueFromMultilangItem(language, i.description),
                          180
                        ) +
                        `${
                          getValueFromMultilangItem(language, i.description)
                            .length > 180
                            ? "..."
                            : ""
                        }`
                      }
                      tags={[
                        {
                          name: i.country
                            ? getValueFromMultilangItem(language, i.country)
                            : "",
                          type: "country",
                        },
                        {
                          name: i.publication_date
                            ? moment(i.publication_date).format("YYYY")
                            : "",
                          type: "year",
                        },
                      ]}
                      resourceType="regulations-and-policies"
                      target="_blank"
                      type={
                        i.type
                          ? getValueFromMultilangItem(language, i.type)
                          : ""
                      }
                      link={i.external_link}
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
