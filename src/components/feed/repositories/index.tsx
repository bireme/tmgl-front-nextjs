import {
  EvidenceMapItemDto,
  EvidenceMapsServiceDto,
} from "@/services/types/evidenceMapsDto";
import { Flex, Grid, LoadingOverlay } from "@mantine/core";
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

export const RepositoriesFeed = ({ displayType }: { displayType: string }) => {
  const [loading, setLoading] = useState(false);
  const _service = new RepositorieService();
  const count = 12;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<EvidenceMapItemDto[]>([]);
  const [apiResponse, setApiResponse] = useState<EvidenceMapsServiceDto>();
  const { language } = useContext(GlobalContext);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };
  const getEvidencemaps = async () => {
    setLoading(true);
    try {
      const response = await _service.getResources(
        count,
        (page - 1) * count,
        filter && filter.length > 0 ? filter : undefined
      );
      setTotalPages(response.totalFound / count);
      setItems(response.data);
      setApiResponse(response);
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
                  queryType: "publication_country",
                  label: "Countries",
                  items: apiResponse?.countryFilters
                    .filter((c) => c.lang == language)
                    .map((c) => ({
                      label: c.type,
                      ocorrences: c.count,
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
                  queryType: "region",
                  label: "Region",
                  items: groupOccurrencesByRegion(
                    apiResponse?.countryFilters
                      .filter((c) => c.lang == "en")
                      .map((c) => ({
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
              <></>
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
