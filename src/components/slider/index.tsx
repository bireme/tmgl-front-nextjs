import "react-slideshow-image/dist/styles.css";

import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import { Fade } from "react-slideshow-image";
import styles from "../../styles/components/slider.module.scss";

export interface HeroSliderProps {
  images: Array<AcfImageArray | undefined>;
}

export const HeroImage = ({ image }: { image: string }) => {
  return (
    <div className={styles.Hero}>
      <div className={styles.eachSlide}>
        <div style={{ backgroundImage: `url(${image})` }}></div>
      </div>
    </div>
  );
};

export const HeroSlider = ({ images }: HeroSliderProps) => {
  return (
    <div className={styles.Hero}>
      <Fade
        autoplay={true}
        arrows={false}
        easing="linear"
        indicators={false}
        pauseOnHover={false}
        duration={5000}
      >
        {images.map((image, key) => {
          if (image)
            return (
              <div key={key} className={styles.eachSlide}>
                <div style={{ backgroundImage: `url(${image.url})` }}></div>
              </div>
            );
        })}
      </Fade>
    </div>
  );
};
