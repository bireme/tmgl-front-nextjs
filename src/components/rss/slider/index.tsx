import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
} from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useCallback, useContext, useEffect, useState } from "react";

import { ArticleDTO } from "@/services/types/rssFeedTypes";
import { FetchRSSFeed } from "@/services/rss/RssService";
import { GlobalContext } from "@/contexts/globalContext";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { TrendingTopicSection } from "@/components/sections/topics";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/slider.module.scss";

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
                        title={`${item.title.slice(0, 150)} ${
                          item.title.length > 150 ? "..." : ""
                        }`}
                        excerpt={`${item.description.trim().slice(0, 120)}...`}
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

export const TrendingCarrocel = ({ rssString }: { rssString?: string }) => {
  const [setEmbla] = useState<any>(null);
  const { globalConfig, regionName } = useContext(GlobalContext);
  const [posts, setPosts] = useState<Array<ArticleDTO>>([]);

  const getTrendingTopics = useCallback(async () => {
    let filter = rssString ? rssString : globalConfig?.acf.filter_rss;
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
    <>
      {posts.length > 0 ? (
        <Carousel
          withControls={false}
          slideSize="24.5%"
          slideGap={"lg"}
          align={"start"}
          loop={false}
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
      ) : (
        <>
          <Loader />
        </>
      )}
    </>
  );
};

export interface TrentingTopicCardProps {
  title: string;
  excerpt: string;
  href: string;
}
export const TrendingTopicCard = ({
  title,
  excerpt,
  href,
}: TrentingTopicCardProps) => {
  return (
    <Flex
      className={styles.TrendingTopicSection}
      direction={"column"}
      justify={"space-between"}
    >
      <div className={styles.TrendingText}>
        <h3>{title}</h3>
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
