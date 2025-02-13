import { Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  JournalItemDto,
  JournalServiceDto,
} from "@/services/types/JournalsDto";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { JournalsService } from "@/services/apiRepositories/JournalsService";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { groupOccurrencesByRegion } from "../utils";
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
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<JournalItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<JournalServiceDto>();
  const { language } = useContext(GlobalContext);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };

  const initialFilters = () => {
    if (country) {
      applyFilters([
        {
          parameter: "publication_country",
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
  };

  useEffect(() => {
    initialFilters();
  }, [region, thematicArea, country]);
  const getJournals = async () => {
    setLoading(true);
    try {
      const response = await _service.getResources(
        count,
        (page - 1) * count,
        filter && filter.length > 0 ? filter : undefined
      );
      setTotalPages(response.totalFound / count);
      setItems(response.data);
      if (!apiResponse) {
        setApiResponse(response);
      }
    } catch (error) {
      console.log(error);
      console.log("Error while fetching journals");
    }
    setLoading(false);
  };

  const getJournalDescription = (item: JournalItemDto) => {
    const lang = language ? language : "en";
    let desc = "";
    if (item.description) {
      if (item.description.length > 0) {
        let auxDesc = item.description.find((d) => d.lang == language)?.content;
        if (auxDesc) {
          desc = removeHTMLTagsAndLimit(auxDesc, 180);
        } else {
          desc = "";
        }
      }
    }
    return desc;
  };

  useEffect(() => {
    getJournals();
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
                  queryType: "country",
                  label: "WHO Regions",
                  items: groupOccurrencesByRegion(
                    apiResponse?.countryFilters.map((c) => ({
                      label: c.type,
                      ocorrences: c.count,
                      id: c.queryString,
                    }))
                  ),
                },
                {
                  queryType: "country",
                  label: "Country of Publication",
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
                {
                  queryType: "language",
                  label: "Language",
                  items: apiResponse?.languageFilters
                    .filter((l) => l.lang == language)
                    .map((c) => ({
                      label: c.type,
                      ocorrences: c.count,
                    })),
                },
                {
                  queryType: "indexed_database",
                  label: "Indexed by",
                  items: apiResponse?.indexFilters.map((c) => ({
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
                      size={"Small"}
                      displayType={displayType}
                      image={i.logo ? i.logo : undefined}
                      key={k}
                      title={i.title}
                      tags={_service.formatTags(i, language)}
                      excerpt={getJournalDescription(i)}
                      link={`/journals/${i.id}`}
                    />
                  );
                })}
              </>
            ) : (
              <LoadingOverlay visible={true} style={{ position: "fixed" }} />
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
