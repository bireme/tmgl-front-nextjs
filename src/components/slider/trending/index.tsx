import { ActionIcon, Group } from "@mantine/core";
import { Carousel, Embla } from "@mantine/carousel";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

import { TrendingTopicSection } from "@/components/sections/topics";
import styles from "../../../styles/components/slider.module.scss";
import { useState } from "react";

export const TrendingSlider = () => {
  const [embla, setEmbla] = useState<any>(null);
  const handleNext = () => embla?.scrollNext();
  const handlePrev = () => embla?.scrollPrev();
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
          slideSize="30%"
          slideGap="sm"
          align={"start"}
          loop={false}
          getEmblaApi={setEmbla}
          dragFree
        >
          <Carousel.Slide className={styles.SliderItemContainer}>
            <TrendingTopicSection
              href=""
              title="International Regulatory Cooperation (IRCH) for Herbal Medicines"
              excerpt="Established in 2006, IRCH is a global network of regulatory authorities responsible for regulation of herbal medicines. "
            />
          </Carousel.Slide>
          <Carousel.Slide className={styles.SliderItemContainer}>
            <TrendingTopicSection
              href=""
              title="International Regulatory Cooperation (IRCH) for Herbal Medicines"
              excerpt="Established in 2006, IRCH is a global network of regulatory authorities responsible for regulation of herbal medicines. "
            />
          </Carousel.Slide>

          <Carousel.Slide className={styles.SliderItemContainer}>
            <TrendingTopicSection
              href=""
              title="International Regulatory Cooperation (IRCH) for Herbal Medicines"
              excerpt="Established in 2006, IRCH is a global network of regulatory authorities responsible for regulation of herbal medicines. "
            />
          </Carousel.Slide>
          <Carousel.Slide className={styles.SliderItemContainer}>
            <TrendingTopicSection
              href=""
              title="International Regulatory Cooperation (IRCH) for Herbal Medicines"
              excerpt="Established in 2006, IRCH is a global network of regulatory authorities responsible for regulation of herbal medicines. "
            />
          </Carousel.Slide>
          <Carousel.Slide className={styles.SliderItemContainer}>
            <TrendingTopicSection
              href=""
              title="International Regulatory Cooperation (IRCH) for Herbal Medicines"
              excerpt="Established in 2006, IRCH is a global network of regulatory authorities responsible for regulation of herbal medicines. "
            />
          </Carousel.Slide>
        </Carousel>
      </div>
    </div>
  );
};
