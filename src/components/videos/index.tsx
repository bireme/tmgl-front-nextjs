import { Container, Flex, Grid, LoadingOverlay } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { MultimediaObject } from "@/services/types/multimediaTypes";
import { MultimediaService } from "@/services/apiRepositories/MultimediaService";
import styles from "../../styles/components/video.module.scss";

export interface VideoItemProps {
  title: string;
  href: string;
  thumbnail: string;
  main?: boolean;
}

export const VideoItem = ({ title, href, main, thumbnail }: VideoItemProps) => {
  return (
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
        <div
          className={styles.VideoThumb}
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <p>{title}</p>
      </Flex>
    </a>
  );
};

export interface FixedRelatedVideosSectionProps {
  items: VideoItemProps[];
}

export const FixedRelatedVideosSection = ({
  items,
}: FixedRelatedVideosSectionProps) => {
  return (
    <div className={styles.RelatedVideosSection}>
      <Container size={"xl"}>
        {items?.length > 0 ? (
          <>
            <h3 className={styles.TitleWithIcon}>Related videos</h3>
            <Flex
              className={styles.RelatedVideosSectionFlex}
              direction={{ base: "column", md: "row" }}
              gap={20}
            >
              <div className={styles.MainVideo}>
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
      const response = await _service.getResources(
        language,
        'media_type:"video"' + filter,
        "*:*"
      );
      if (response) setItems(response.response.docs);
    } catch {
      console.log("error while fetching multimedia");
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
                      ? items[0].title_translated
                      : items[0].title
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
                        : items[1].title
                    }
                    href={items[1].link}
                    thumbnail={items[1].thumbnail ? items[1].thumbnail : ""}
                  />
                  <VideoItem
                    title={
                      language == "en"
                        ? items[2].title_translated
                        : items[2].title
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
