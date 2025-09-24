import {} from "@/services/types/regulationsAndPolices";

import { Center, Flex, Grid, LoadingOverlay, Title } from "@mantine/core";
import {
  DefaultResourceDto,
  DefaultResourceItemDto,
} from "@/services/types/defaultResource";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { GlobalSummitService } from "@/services/apiRepositories/GlobalSummitService";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { initialFilters } from "../utils";
import { queryType } from "@/services/types/resources";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export const GlobalSummitFeed = ({
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
  const _service = new GlobalSummitService();
  const count = 12;
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [dataResp, setDataResp] = useState<DefaultResourceDto>();
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

      setTotalPages(Math.max(1, Math.ceil(response.totalFound / count)));
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
      console.log(error);
      console.log("Error while fetching Legislations");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (globalConfig) getRegulationsAndPolicies();
  }, [page, filter, thematicArea, region, country, globalConfig]);

  const isNonEmptyString = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  const toTag = (name: unknown, type: "country" | "region" | "descriptor") =>
    isNonEmptyString(name) ? [{ name, type }] : [];

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
                  label: "WHO region",
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
                  queryType: "thematic_area",
                  label: "Thematic area",
                  items: apiResponse?.thematicAreaFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
                  })),
                },
                {
                  queryType: "document_type",
                  label: "Document Type",
                  items: apiResponse?.documentTypeFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
                  })),
                },
                {
                  queryType: "year",
                  label: "Year",
                  items: apiResponse?.yearFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                    id: undefined,
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
              Showing {items.length} of {apiResponse?.totalFound} results found
            </Title>
          ) : (
            <></>
          )}
          <div 
            style={{
              display: "grid",
              gridTemplateColumns: displayType === "column" 
                ? "repeat(auto-fit, minmax(300px, 1fr))" 
                : "1fr",
              gap: "30px",
              alignItems: "stretch"
            }}
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
                        ...toTag(i.country, "country"),
                        ...toTag(i.region, "region"),

                        ...(Array.isArray(i.thematicArea)
                          ? i.thematicArea
                              .filter(isNonEmptyString) // agora TS sabe que é string
                              .map((tag) => ({
                                name: tag,
                                type: "descriptor" as const,
                              }))
                          : toTag(i.thematicArea, "descriptor")),
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
