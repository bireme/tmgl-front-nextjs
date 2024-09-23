import "react-slideshow-image/dist/styles.css";

import { Fade, Slide } from "react-slideshow-image";

import styles from "../../styles/components/slider.module.scss";

export interface HeroSliderProps {
  images: Array<string | undefined>;
}

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
                <div style={{ backgroundImage: `url(${image})` }}></div>
              </div>
            );
        })}
      </Fade>
    </div>
  );
};
