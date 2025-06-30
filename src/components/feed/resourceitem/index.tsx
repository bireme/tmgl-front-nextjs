import { Badge, Flex } from "@mantine/core";
import { IconArrowRight, IconPlayerPlay } from "@tabler/icons-react";

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
}: ResourceCardProps) => {
  const colors = {
    country: "#69A221",
    descriptor: "#8B142A",
    region: "#3F6114",
  };

  const applyTag = (tagType: string, tagName: string) => {
    window.location.href = `${window.location.pathname}?${tagType}=${tagName}`;
  };

  return (
    <Flex
      direction={displayType == "column" ? "column" : "row"}
      align={displayType == "column" ? "flex-end" : "flex-start"}
      justify={"space-between"}
      gap={30}
      className={`${styles.ResourceCard} ${
        displayType == "column" ? "" : styles.Row
      } ${size == "Small" ? styles.Small : "auto"}`}
    >
      {type == "Pdf" && displayType != "column" ? (
        <iframe
          src={link}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            overflow: "hidden",
          }}
        ></iframe>
      ) : (
        image &&
        displayType != "column" &&
        type != "Pdf" && (
          <div
            className={styles.CardImage}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        )
      )}
      <div className={styles.CardContent}>
        {type == "Pdf" && displayType == "column" ? (
          <iframe
            src={link}
            className={styles.CardImage}
            scrolling="no"
            style={{
              border: "none",
              overflowY: "hidden",
            }}
          ></iframe>
        ) : (
          image &&
          displayType == "column" && (
            <div
              className={styles.CardImage}
              style={{ backgroundImage: `url(${image})` }}
            >
              {type == "Video" ? (
                <>
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
                </>
              ) : (
                <></>
              )}
            </div>
          )
        )}
        <small>{type}</small>
        <h3>{title}</h3>
        <p>{excerpt}</p>
      </div>
      <Flex style={{ width: "100%" }} direction={"column"}>
        <Flex mb={20} wrap={"wrap"} gap={5} className={styles.Tags}>
          {tags
            ?.filter((tag) => tag.type == "descriptor")
            .map((tag) => (
              <Badge
                onClick={() => applyTag("thematicArea", tag.name)}
                size={"md"}
                key={tag.name}
                color={colors.descriptor}
              >
                {tag.name}
              </Badge>
            ))}
          {tags
            ?.filter((tag) => tag.type == "region")
            .map((tag) => (
              <Badge
                onClick={() => applyTag("region", tag.name)}
                size={"md"}
                key={tag.name}
                color={colors.region}
              >
                {tag.name}
              </Badge>
            ))}
          {tags
            ?.filter((tag) => tag.type == "country")
            .map((tag) => (
              <Badge
                onClick={() => applyTag("country", tag.name)}
                size={"md"}
                key={tag.name}
                color={colors.country}
              >
                {tag.name}
              </Badge>
            ))}
        </Flex>
        <Flex
          align={"flex-end"}
          justify={"flex-end"}
          style={{ height: displayType == "column" ? "auto" : "100%" }}
        >
          <a href={link} target={target}>
            {" "}
            <IconArrowRight />{" "}
          </a>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const MediaCard = {};
