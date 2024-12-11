import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Flex, Grid, GridCol, LoadingOverlay } from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";
import { LisDocuments } from "@/services/types/lisTypes";
import { LisService } from "@/services/lis/LisService";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/resources.module.scss";

export interface ResourceCardProps {
  title: string;
  excerpt: string;
  link: string;
  displayType: string;
  image?: string;
  tags?: Array<string>;
}
export const ResourceCard = ({
  title,
  excerpt,
  link,
  displayType,
  image,
  tags,
}: ResourceCardProps) => {
  return (
    <Flex
      direction={displayType == "column" ? "column" : "row"}
      align={displayType == "column" ? "flex-end" : "flex-start"}
      justify={"space-between"}
      gap={30}
      className={`${styles.ResourceCard} ${
        displayType == "column" ? "" : styles.Row
      }`}
    >
      {image && displayType != "column" && (
        <div
          className={styles.CardImage}
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      )}
      <div className={styles.CardContent}>
        {image && displayType == "column" && (
          <div
            className={styles.CardImage}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        )}
        <h3>{title}</h3>
        <p>{excerpt}</p>
      </div>
      <Flex
        align={"flex-end"}
        style={{ height: displayType == "column" ? "auto" : "100%" }}
      >
        <a href={link}>
          {" "}
          <IconArrowRight />{" "}
        </a>
      </Flex>
    </Flex>
  );
};

export interface PaginationProps {
  currentIndex: number;
  totalPages: number;
  callBack: Dispatch<SetStateAction<number>>;
}
export const Pagination = ({
  currentIndex,
  totalPages,
  callBack,
}: PaginationProps) => {
  return (
    <Flex className={styles.Pagination} gap={5}>
      <a
        className={currentIndex - 1 < 1 ? styles.disabled : ""}
        onClick={() => {
          callBack(currentIndex - 1);
        }}
      >
        Prev{" "}
      </a>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((i, k) => {
        return (
          <a
            key={k}
            onClick={() => callBack(i)}
            className={i == currentIndex ? styles.active : ""}
          >
            {i}
          </a>
        );
      })}
      <a
        className={currentIndex + 1 > totalPages ? styles.disabled : ""}
        onClick={() => {
          callBack(currentIndex + 1);
        }}
      >
        Next
      </a>
    </Flex>
  );
};

export interface ResourcesFeedSectionProps {
  thematicArea: string;
  displayType: string;
}
export const ResourcesFeedSection = ({
  thematicArea,
  displayType,
}: ResourcesFeedSectionProps) => {
  const [items, setItems] = useState<LisDocuments[]>([]);
  const _lisService = new LisService();
  const count = 3;

  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const getResources = async () => {
    const response = await _lisService.getResources(
      thematicArea,
      count,
      (page - 1) * count
    );
    setItems(response.data.diaServerResponse[0]?.response.docs);
    setTotalPages(
      Math.round(response.data.diaServerResponse[0]?.response.numFound / count)
    );
  };

  useEffect(() => {
    getResources();
  }, [page]);

  return (
    <Grid>
      <Grid.Col span={3.5}></Grid.Col>
      <Grid.Col span={8.5}>
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
                    excerpt={removeHTMLTagsAndLimit(i.abstract, 140)}
                    link={i.link[0]}
                  />
                );
              })}
            </>
          ) : (
            <LoadingOverlay visible={true} />
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
  );
};
