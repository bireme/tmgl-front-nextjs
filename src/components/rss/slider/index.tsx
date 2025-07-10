import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Group,
  Loader,
} from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useCallback, useContext, useEffect, useState } from "react";

import { ArticleDTO } from "@/services/types/rssFeedTypes";
import { Carousel } from "@mantine/carousel";
import { FetchRSSFeed } from "@/services/rss/RssService";
import { GlobalContext } from "@/contexts/globalContext";
import { TrendingTopicSection } from "@/components/sections/topics";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../../styles/components/slider.module.scss";
import { useRouter } from "next/router";

export const TrendingSlider = () => {
  const [embla, setEmbla] = useState<any>(null);
  const handleNext = () => embla?.scrollNext();
  const handlePrev = () => embla?.scrollPrev();
  const { globalConfig, regionName } = useContext(GlobalContext);
  const [posts, setPosts] = useState<Array<ArticleDTO>>([]);

  const getTrendingTopics = useCallback(async () => {
    let filter = globalConfig?.acf.filter_rss;
    if (regionName) {
      let regionalFilter = globalConfig?.acf.region_filters.filter(
        (f) => f.region_prefix.toLowerCase() == regionName.toLowerCase()
      );
      if (regionalFilter)
        if (regionalFilter.length > 0) {
          filter = regionalFilter[0].region_filter;
        }
    }

    if (globalConfig?.acf.filter_rss) {
      const articlesResponse = await FetchRSSFeed(0, 10, 1, undefined, filter);
      setPosts(articlesResponse);
    }
  }, [globalConfig]);

  useEffect(() => {
    getTrendingTopics();
  }, [getTrendingTopics, globalConfig]);

  return (
    <div className={styles.TrandingSliderContainer}>
      {posts.length > 0 ? (
        <div className={styles.TrandingSlider}>
          <Group
            align="flex-end"
            justify="flex-end"
            gap={10}
            mb={20}
            className={styles.Controlls}
          >
            <ActionIcon radius={"xl"} onClick={handlePrev}>
              <IconArrowLeft stroke={0.9} />
            </ActionIcon>
            <ActionIcon radius={"xl"} onClick={handleNext}>
              <IconArrowRight stroke={1} />
            </ActionIcon>
          </Group>

          <Carousel
            withControls={false}
            slideSize="15%"
            slideGap="sm"
            align={"start"}
            loop={false}
            getEmblaApi={setEmbla}
            dragFree
          >
            {posts?.length > 0 ? (
              posts?.map((item, key) => {
                return (
                  <div key={key}>
                    <Carousel.Slide
                      key={key}
                      className={styles.SliderItemContainer}
                    >
                      <TrendingTopicSection
                        href={item.link}
                        title={`${decodeHtmlEntities(
                          item.title.slice(0, 150)
                        )} ${item.title.length > 150 ? "..." : ""}`}
                        excerpt={`${decodeHtmlEntities(
                          item.description.trim().slice(0, 120)
                        )}...`}
                      />
                    </Carousel.Slide>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </Carousel>
        </div>
      ) : (
        <>
          <Loader color="white" />
        </>
      )}
    </div>
  );
};

export const TrendingCarrocel = ({
  rssString,
  allFilter,
}: {
  rssString?: string;
  allFilter?: string;
}) => {
  const [setEmbla] = useState<any>(null);
  const { globalConfig, regionName } = useContext(GlobalContext);
  const [posts, setPosts] = useState<Array<ArticleDTO>>([]);
  const router = useRouter();

  const getTrendingTopics = useCallback(async () => {
    let filter = rssString ? rssString : globalConfig?.acf.filter_rss;

    if (regionName && !rssString) {
      let regionalFilter = globalConfig?.acf.region_filters.filter(
        (f) => f.region_prefix.toLowerCase() == regionName.toLowerCase()
      );
      if (regionalFilter)
        if (regionalFilter.length > 0) {
          filter = regionalFilter[0].region_filter;
        }
    }

    if (globalConfig?.acf.filter_rss) {
      const articlesResponse = await FetchRSSFeed(0, 10, 1, undefined, filter);
      setPosts(articlesResponse);
    }
  }, [globalConfig]);

  useEffect(() => {
    getTrendingTopics();
  }, [getTrendingTopics, globalConfig]);

  return (
    <div className={styles.CountryRss}>
      <Container py={10} size={"xl"}>
        <h3 className={styles.TitleWithIcon}>Recent literature reviews</h3>
        {posts.length > 0 ? (
          <>
            <Carousel
              nextControlIcon={<IconArrowRight size={16} />}
              previousControlIcon={<IconArrowLeft size={16} />}
              slideSize={{ base: "100%", md: "50%", lg: "32%" }}
              align={"center"}
              loop={false}
              slidesToScroll={3}
              getEmblaApi={setEmbla}
              className={styles.TrandingCarrocelContainer}
            >
              {posts?.length > 0 ? (
                posts?.map((item, key) => {
                  return (
                    <Carousel.Slide
                      key={key}
                      className={styles.SliderItemContainer}
                    >
                      <TrendingTopicCard
                        height="300px"
                        href={item.link}
                        title={`${item.title.slice(0, 150)} ${
                          item.title.length > 150 ? "..." : ""
                        }`}
                        excerpt={`${item.description.trim().slice(0, 120)}...`}
                      />
                    </Carousel.Slide>
                  );
                })
              ) : (
                <></>
              )}
            </Carousel>
            <Flex
              mt={25}
              gap={10}
              align={"center"}
              onClick={() => {
                !rssString
                  ? router.push(
                      `/recent-literature-reviews${
                        allFilter ? "?country=" + allFilter : ""
                      }`
                    )
                  : router.push(
                      `/recent-literature-reviews${
                        rssString ? "?filter=" + encodeURI(rssString) : ""
                      }`
                    );
              }}
              component="a"
              style={{ cursor: "pointer" }}
            >
              Explore all{" "}
              <Button size={"xs"} p={5}>
                <IconArrowRight stroke={1} />
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <Loader />
          </>
        )}
      </Container>
    </div>
  );
};

export interface TrentingTopicCardProps {
  title: string;
  excerpt: string;
  href: string;
  height?: string;
}
export const TrendingTopicCard = ({
  title,
  excerpt,
  href,
  height,
}: TrentingTopicCardProps) => {
  return (
    <Flex
      className={styles.TrendingTopicSection}
      direction={"column"}
      justify={"space-between"}
      style={{ height: height }}
    >
      <div className={styles.TrendingText}>
        <h3>
          {decodeHtmlEntities(
            title.length > 140 ? title.slice(0, 140) + "..." : title
          )}
        </h3>
        <div dangerouslySetInnerHTML={{ __html: excerpt }} />
      </div>
      <div className={styles.TrendingLink}>
        <a href={href} className={styles.TrendingButton}>
          <Button p={8} radius={"md"} size={"sm"}>
            <IconArrowRight size={19} stroke={1.5} />
          </Button>
        </a>
      </div>
    </Flex>
  );
};
