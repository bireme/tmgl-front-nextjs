import { ActionIcon, Group } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { ArticleDTO } from "@/services/types/rssFeedTypes";
import { FetchRSSFeed } from "@/services/rss/RssService";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { TrendingTopicSection } from "@/components/sections/topics";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/slider.module.scss";

export const TrendingSlider = () => {
  const [embla, setEmbla] = useState<any>(null);
  const handleNext = () => embla?.scrollNext();
  const handlePrev = () => embla?.scrollPrev();

  const [posts, setPosts] = useState<Array<ArticleDTO>>([]);

  const getTrendingTopics = useCallback(async () => {
    const articlesResponse = await FetchRSSFeed("en", 0, 10, 1);
    setPosts(articlesResponse);
  }, []);

  useEffect(() => {
    getTrendingTopics();
  }, [getTrendingTopics]);

  return (
    <div className={styles.TrandingSliderContainer}>
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
    </div>
  );
};
