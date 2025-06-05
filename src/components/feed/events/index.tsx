import { Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { EventsItemsDto, EventsServiceDto } from "@/services/types/eventsDto";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useContext, useEffect, useState } from "react";

import { DireveService } from "@/services/apiRepositories/DireveService";
import { GlobalContext } from "@/contexts/globalContext";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { groupOccurrencesByRegion } from "../utils";
import { queryType } from "@/services/types/resources";
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
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<EventsItemsDto[]>([]);
  const [apiResponse, setApiResponse] = useState<EventsServiceDto>();
  const { language } = useContext(GlobalContext);
  const [initialFilterDone, setInitialFilterDone] = useState<boolean>(false);

  const initialFilters = (apiResponse: EventsServiceDto) => {
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

  useEffect(() => {
    getEvents();
  }, [country, region, thematicArea]);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };
  const getEvents = async () => {
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
      console.log("Error while fetching Events");
    }
    setLoading(false);
  };

  useEffect(() => {
    getEvents();
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
                  queryType: "publication_year",
                  label: "Publication Year",
                  items: apiResponse?.publicationYearFilter?.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                  })),
                },
                {
                  queryType: "country",
                  label: "Country",
                  items: apiResponse?.countryFilters.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                  })),
                },
                {
                  queryType: "descriptor_filter",
                  label: "Thematic area",
                  items: apiResponse?.descriptorFilter.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                  })),
                },
                {
                  queryType: "Region",
                  label: "WHO Regions",
                  items: groupOccurrencesByRegion(
                    apiResponse?.countryFilters.map((c) => ({
                      label: c.type,
                      ocorrences: c.count,
                    }))
                  ),
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
                      title={`${removeHTMLTagsAndLimit(
                        i.title ? i.title : "",
                        100
                      )} ${i.title?.length > 100 ? "..." : ""}`}
                      tags={_service.formatTags(i, language)}
                      excerpt={`${removeHTMLTagsAndLimit(
                        i.observations ? i.observations : "",
                        180
                      )} ${i.observations?.length > 180 ? "..." : ""}`}
                      link={i.links ? i.links[0].url : ""}
                      target="_blank"
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
