import { Container, Flex, Grid } from "@mantine/core";

import styles from "../../styles/components/video.module.scss";

export interface VideoItemProps {
  title: string;
  href: string;
  thumbnail: string;
  main?: boolean;
}

export const VideoItem = ({ title, href, main, thumbnail }: VideoItemProps) => {
  return (
    <a href={href} className={styles.LinkVideoItem}>
      <Flex
        justify={"center"}
        align={main ? "" : "flex-start"}
        className={`${styles.VideoItem} ${main ? styles.Main : ""}`}
        direction={main ? "column" : { base: "column", md: "row" }}
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

export const RelatedVideosSection = () => {
  return (
    <div className={styles.RelatedVideosSection}>
      <Container size={"xl"}>
        <h2>Related videos</h2>
        <Grid>
          <Grid.Col span={{ base: 12, md: 7.5 }} px={{ base: 0, md: 15 }}>
            <VideoItem
              title={"Guia das Parteiras Tradicionais na Amazônia"}
              href={"https://www.youtube.com/"}
              main={true}
              thumbnail={"/local/png/video1.png"}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4.5 }}>
            <Flex direction={{ base: "column" }} gap={30}>
              <VideoItem
                title={"Guia das Parteiras Tradicionais na Amazônia"}
                href={"https://www.youtube.com/"}
                thumbnail={"/local/png/video2.png"}
              />
              <VideoItem
                title={"Guia das Parteiras Tradicionais na Amazônia"}
                href={"https://www.youtube.com/"}
                thumbnail={"/local/png/video3.png"}
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
};
