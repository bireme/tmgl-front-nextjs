import { Flex, Grid, GridCol, LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";

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
  const [count, setCount] = useState<number>(12);
  const [offset, setOffset] = useState<number>(0);
  const getResources = async () => {
    const response = await _lisService.getResources(
      thematicArea,
      count,
      offset
    );
    setItems(response.data.diaServerResponse[0]?.response.docs);
  };

  useEffect(() => {
    getResources();
  }, []);

  return (
    <Grid>
      <Grid.Col span={3}></Grid.Col>
      <Grid.Col span={9}>
        <Flex
          direction={{
            base: displayType == "column" ? "column" : "row",
            md: "row",
          }}
          gap={30}
          wrap={"wrap"}
          justify={"flex-end"}
        >
          {items.length > 0 ? (
            <>
              {items.map((i, k) => {
                return (
                  <ResourceCard
                    displayType={displayType}
                    key={k}
                    image="https://cursinhoparamedicina.com.br/wp-content/uploads/2022/10/Paisagem-1.jpg"
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
      </Grid.Col>
    </Grid>
  );
};
