import { Container, Flex } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { IframeThumbNail } from "../feed/multimedia/pdf_thumbnail";
import { MultimediaObject } from "@/services/types/multimediaTypes";
import { MultimediaService } from "@/services/apiRepositories/MultimediaService";
import { queryType } from "@/services/types/resources";
import styles from "../../styles/components/video.module.scss";
import { capitalizeFirstLetter } from "@/helpers/stringhelper";

export interface VideoItemProps {
  title: string;
  href: string;
  thumbnail: string;
  main?: boolean;
}

export const VideoItem = ({ title, href, main, thumbnail }: VideoItemProps) => {
  const isPdf = (thumb: string): boolean => {
    if (typeof thumb !== "string") return false;
    const clean = thumb.split("?")[0];
    return clean.toLowerCase().endsWith(".pdf");
  };

  return (
    <>
      <a
        href={href}
        target="_blank"
        className={styles.LinkVideoItem}
        style={{ height: main ? "100%" : "47%" }}
      >
        <Flex
          justify={"flex-start"}
          align={main ? "" : "flex-start"}
          className={`${styles.VideoItem} ${main ? styles.Main : ""}`}
          direction={main ? "column" : { base: "row", md: "row" }}
        >
          {!isPdf(thumbnail) ? (
            <>
              <div
                className={styles.VideoThumb}
                style={{
                  backgroundPosition: "center center",
                  backgroundImage: `url(${thumbnail})`,
                }}
              />{" "}
            </>
          ) : (
            <IframeThumbNail url={thumbnail} height="100%" />
          )}

          <p>{title}</p>
        </Flex>
      </a>
    </>
  );
};

export interface FixedRelatedVideosSectionProps {
  items: VideoItemProps[];
  title?: string;
  backgroundColor?: string;
}

export const FixedRelatedVideosSection = ({
  items,
  title,
  backgroundColor,
}: FixedRelatedVideosSectionProps) => {
  return (
    <div className={styles.RelatedVideosSection} style={{ backgroundColor: backgroundColor ?? "inherit" }}  >
      <Container size={"xl"}>
        {items?.length > 0 ? (
          <>
            <h2 className={styles.TitleWithIcon}>
              {capitalizeFirstLetter(title ? title : "Related videos")}
            </h2>
            <Flex
              className={styles.RelatedVideosSectionFlex}
              direction={{ base: "column", md: "row" }}
              gap={20}
            >
              <div
                className={`${styles.MainVideo} ${
                  items?.length == 1 ? styles.w100 : ""
                }`}
              >
                <VideoItem
                  title={items[0].title}
                  href={items[0].href}
                  main={true}
                  thumbnail={items[0].thumbnail ? items[0].thumbnail : ""}
                />
              </div>
              {items.length > 1 && (
                <div className={styles.SideVideos}>
                  <Flex
                    style={{ height: "100%" }}
                    direction={{ base: "column" }}
                    justify={"space-between"}
                    gap={{ base: 30, md: 0 }}
                  >
                    <VideoItem
                      title={items[1].title}
                      href={items[1].href}
                      thumbnail={items[1].thumbnail ? items[1].thumbnail : ""}
                    />
                    {items.length > 2 && (
                      <VideoItem
                        title={items[2].title}
                        href={items[2].href}
                        thumbnail={items[2].thumbnail ? items[2].thumbnail : ""}
                      />
                    )}
                  </Flex>
                </div>
              )}
            </Flex>{" "}
          </>
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};

export interface RelatedVideosSectionProps {
  filter?: string;
}

export const RelatedVideosSection = ({ filter }: RelatedVideosSectionProps) => {
  const _service = new MultimediaService();
  const [items, setItems] = useState<MultimediaObject[]>([]);
  const { language } = useContext(GlobalContext);

  const getItems = async () => {
    try {
      const response = await _service.getResources(3, 0, [], language);
      if (response) setItems(response.data);
    } catch {
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className={styles.RelatedVideosSection}>
      <Container size={"xl"}>
        {items?.length > 0 ? (
          <>
            <h2>Related videos</h2>
            <Flex className={styles.RelatedVideosSectionFlex} gap={20}>
              <div className={styles.MainVideo}>
                <VideoItem
                  title={
                    language == "en"
                      ? items[0].title_translated[0]
                      : items[0].title[0]
                  }
                  href={items[0].link}
                  main={true}
                  thumbnail={items[0].thumbnail ? items[0].thumbnail : ""}
                />
              </div>
              <div className={styles.SideVideos}>
                <Flex
                  style={{ height: "100%" }}
                  direction={{ base: "column" }}
                  justify={"space-between"}
                >
                  <VideoItem
                    title={
                      language == "en"
                        ? items[1].title_translated[0]
                        : items[1].title[0]
                    }
                    href={items[1].link}
                    thumbnail={items[1].thumbnail ? items[1].thumbnail : ""}
                  />
                  <VideoItem
                    title={
                      language == "en"
                        ? items[2].title_translated[0]
                        : items[2].title[0]
                    }
                    href={items[2].link}
                    thumbnail={items[2].thumbnail ? items[2].thumbnail : ""}
                  />
                </Flex>
              </div>
            </Flex>{" "}
          </>
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};

export interface RecentMultimediaItemsSectionProps {
  filter?: queryType[];
}
export const RecentMultimediaItems = ({
  filter,
}: RecentMultimediaItemsSectionProps) => {
  const _service = new MultimediaService();
  const [items, setItems] = useState<MultimediaObject[]>([]);
  const { language } = useContext(GlobalContext);

  const getItems = async () => {
    try {
      const response = await _service.getResources(
        3,
        0,
        filter ? filter : [],
        language
      );
      if (response) setItems(response.data);
    } catch {
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className={styles.RelatedVideosSection}>
      <Container size={"xl"}>
        {items?.length > 0 ? (
          <>
            <h2 className={styles.TitleWithIcon}>{capitalizeFirstLetter("Related media")}</h2>
            <Flex className={styles.RelatedVideosSectionFlex} gap={20}>
              <div className={styles.MainVideo}>
                <VideoItem
                  title={
                    language == "en"
                      ? items[0].title_translated
                        ? items[0].title_translated
                        : items[0].title
                        ? items[0].title
                        : ""
                      : ""
                  }
                  href={items[0].link}
                  main={true}
                  thumbnail={items[0].thumbnail ? items[0].thumbnail : ""}
                />
              </div>
              <div className={styles.SideVideos}>
                <Flex
                  style={{ height: "100%" }}
                  direction={{ base: "column" }}
                  justify={"space-between"}
                >
                  <VideoItem
                    title={
                      language == "en"
                        ? items[1].title_translated
                          ? items[1].title_translated
                          : items[1].title
                          ? items[1].title
                          : ""
                        : ""
                    }
                    href={items[1].link}
                    thumbnail={items[1].thumbnail ? items[1].thumbnail : ""}
                  />
                  <VideoItem
                    title={
                      language == "en"
                        ? items[2].title_translated
                          ? items[2].title_translated
                          : items[2].title
                          ? items[2].title
                          : ""
                        : ""
                    }
                    href={items[2].link}
                    thumbnail={items[2].thumbnail ? items[2].thumbnail : ""}
                  />
                </Flex>
              </div>
            </Flex>{" "}
          </>
        ) : (
          <></>
        )}
      </Container>
    </div>
  );
};
