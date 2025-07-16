import { Badge, Flex, LoadingOverlay } from "@mantine/core";
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { IframeThumbNail } from "../multimedia/pdf_thumbnail";
import moment from "moment";
import styles from "../../../styles/components/resources.module.scss";

export interface ResourceCardProps {
  title: string;
  excerpt: string;
  link: string;
  displayType: string;
  image?: string;
  tags?: Array<TagItem>;
  resourceType?: string;
  size?: string;
  target?: string;
  type?: string;
}

export interface TagItem {
  name: string;
  type: string;
}

export const ResourceCard = ({
  title,
  excerpt,
  link,
  displayType,
  image,
  tags,
  size,
  target = "_self",
  type,
  resourceType,
}: ResourceCardProps) => {
  const isPdf = (thumb: string | string[]): boolean => {
    if (type == "Pdf") return true;
    if (Array.isArray(thumb)) thumb = thumb[0];
    if (typeof thumb !== "string") return false;
    return thumb.split("?")[0].toLowerCase().endsWith(".pdf");
  };

  const isImage = (thumb: string | string[]): boolean => {
    if (Array.isArray(thumb)) thumb = thumb[0];
    if (typeof thumb !== "string") return false;

    const url = thumb.split("?")[0].toLowerCase();
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(url);
  };

  const colors = {
    country: "#69A221",
    descriptor: "#8B142A",
    region: "#3F6114",
    type: "#1A4B8C",
  };

  const applyTag = (tagType: string, tagName: string) => {
    window.location.href = `${window.location.pathname}?${tagType}=${tagName}`;
  };

  const cardImage = () => {
    if (image) {
      if (isPdf(image)) {
        return <IframeThumbNail url={image} type={resourceType} />;
      }
      if (isImage(image)) {
        return (
          <div
            className={styles.CardImage}
            style={{ backgroundImage: `url(${image})` }}
          >
            {type === "Video" && (
              <IconPlayerPlay
                color="white"
                size={30}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "black 2px 2px 2px",
                }}
              />
            )}
          </div>
        );
      }
      return <></>;
    }
  };

  return (
    <Flex
      direction={displayType === "column" ? "column" : "row"}
      align={displayType === "column" ? "flex-end" : "flex-start"}
      justify="space-between"
      gap={30}
      className={`${styles.ResourceCard} ${
        displayType === "column" ? "" : styles.Row
      } ${size === "Small" ? styles.Small : "auto"}`}
    >
      {image && displayType !== "column" ? cardImage() : <></>}
      <div className={styles.CardContent}>
        {image && displayType === "column" ? cardImage() : <></>}
        <small>{type}</small>
        <h3>{title}</h3>
        <p>{excerpt}</p>
      </div>
      <Flex style={{ width: "100%" }} direction="column">
        <Flex mb={20} wrap="wrap" gap={5} className={styles.Tags}>
          {tags
            ?.filter((tag) => tag.type === "descriptor")
            .map((tag) => (
              <Badge
                onClick={() => applyTag("thematicArea", tag.name)}
                size="md"
                key={tag.name}
                color={colors.descriptor}
              >
                {tag.name}
              </Badge>
            ))}
          {tags
            ?.filter((tag) => tag.type === "region")
            .map((tag) => (
              <Badge
                onClick={() => applyTag("region", tag.name)}
                size="md"
                key={tag.name}
                color={colors.region}
              >
                {tag.name}
              </Badge>
            ))}
          {tags
            ?.filter((tag) => tag.type === "country")
            .map((tag) => (
              <Badge
                onClick={() => applyTag("country", tag.name)}
                size="md"
                key={tag.name}
                color={colors.country}
              >
                {tag.name}
              </Badge>
            ))}
          {tags
            ?.filter((tag) => tag.type === "type")
            .map((tag) => (
              <Badge size="md" key={tag.name} color={colors.type}>
                {tag.name}
              </Badge>
            ))}
          {tags
            ?.filter(
              (tag) =>
                tag.type === "year" &&
                moment(tag.name, moment.ISO_8601, true).isValid()
            )
            .map((tag) => (
              <Badge size="md" key={tag.name} color={colors.descriptor}>
                {tag.name}
              </Badge>
            ))}
        </Flex>
        <Flex
          align="flex-end"
          justify="flex-end"
          style={{ height: displayType === "column" ? "auto" : "100%" }}
        >
          <a href={link} target={target}>
            <IconArrowRight />
          </a>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const MediaCard = {};
