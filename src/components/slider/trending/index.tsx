import { ActionIcon, Group } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";

import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { TrendingTopicSection } from "@/components/sections/topics";
import styles from "../../../styles/components/slider.module.scss";

export const TrendingSlider = () => {
  const [embla, setEmbla] = useState<any>(null);
  const handleNext = () => embla?.scrollNext();
  const handlePrev = () => embla?.scrollPrev();

  const [posts, setPosts] = useState<Array<Post>>([]);

  const getTrendingTopics = useCallback(async () => {
    const _api = new PostsApi();

    try {
      const resp = await _api.getCustomPost("trending_topics");
      setPosts(resp);
    } catch (error: any) {
      console.log("Error while get trendingTopics", error);
    }
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
                      href={`/trending-topics/${item.slug}`}
                      title={`${item.title.rendered}`}
                      excerpt={`${item.excerpt.rendered}`}
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
