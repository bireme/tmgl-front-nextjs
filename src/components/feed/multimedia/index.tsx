import { Center, Flex, Grid, LoadingOverlay } from "@mantine/core";
import {
  MultimediaObject,
  MultimediaServiceDto,
} from "@/services/types/multimediaTypes";
import {
  decodeHtmlEntities,
  removeHTMLTagsAndLimit,
} from "@/helpers/stringhelper";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { MultimediaService } from "@/services/apiRepositories/MultimediaService";
import { Pagination } from "../pagination";
import { ResourceCard } from "../resourceitem";
import { ResourceFilters } from "../filters";
import { queryType } from "@/services/types/resources";
import styles from "../../../styles/components/resources.module.scss";
import { translateType } from "./functions";

export const MultimediaFeed = ({
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
  const _service = new MultimediaService();
  const count = 11;
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filter, setFilter] = useState<queryType[]>([]);
  const [items, setItems] = useState<MultimediaObject[]>([]);
  const [apiResponse, setApiResponse] = useState<MultimediaServiceDto>();
  const { language } = useContext(GlobalContext);

  const applyFilters = async (queryList?: queryType[]) => {
    setFilter(queryList ? queryList : []);
    setPage(1);
  };
  const getMedias = async () => {
    setLoading(true);
    try {
      const response = await _service.getResources(
        count + 1,
        (page - 1) * count,
        filter && filter.length > 0 ? filter : undefined,
        language
      );

      setTotalPages(Math.ceil(response.totalFound / count));
      setItems(response.data);
      setApiResponse(response);
    } catch (error) {
      console.log(error);
      console.log("Error while fetching Evidencemaps");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (globalConfig) getMedias();
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
                {
                  queryType: "language",
                  label: "Language",
                  items: apiResponse?.languageFilters.map((c) => ({
                    label: c.type,
                    ocorrences: c.count,
                  })),
                },
                {
                  queryType: "media_type",
                  label: "Media Type",
                  items: apiResponse?.typeFilters
                    .filter((c) => c.lang == language)
                    .map((c) => ({
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
                      displayType={displayType}
                      key={k}
                      target="_blank"
                      title={decodeHtmlEntities(
                        i.title_translated
                          ? i.title_translated[0]
                          : i.title
                          ? i.title
                          : ""
                      )}
                      type={i.media_type ? i.media_type : ""}
                      image={i.thumbnail ? i.thumbnail : ""}
                      excerpt={`${removeHTMLTagsAndLimit(
                        i.description ? i.description[0] : "",
                        120
                      )} ${
                        i.description
                          ? i.description[0].length > 120
                            ? "..."
                            : ""
                          : ""
                      }`}
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
