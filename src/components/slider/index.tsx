import "react-slideshow-image/dist/styles.css";

import { Fade, Slide } from "react-slideshow-image";

import styles from "../../styles/components/slider.module.scss";

export const HeroSlider = () => {
  const images = [
    "/local/webp/img-search-1.webp",
    "/local/webp/img-search-2.webp",
    "/local/webp/img-search-3.webp",
    "/local/webp/img-search-4.webp",
    "/local/webp/img-search-5.webp",
    "/local/webp/img-search-6.webp",
  ];

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
        <div className={styles.eachSlide}>
          <div style={{ backgroundImage: `url(${images[0]})` }}></div>
        </div>
        <div className={styles.eachSlide}>
          <div style={{ backgroundImage: `url(${images[1]})` }}></div>
        </div>
        <div className={styles.eachSlide}>
          <div style={{ backgroundImage: `url(${images[2]})` }}></div>
        </div>
        <div className={styles.eachSlide}>
          <div style={{ backgroundImage: `url(${images[3]})` }}></div>
        </div>
        <div className={styles.eachSlide}>
          <div style={{ backgroundImage: `url(${images[4]})` }}></div>
        </div>
        <div className={styles.eachSlide}>
          <div style={{ backgroundImage: `url(${images[5]})` }}></div>
        </div>
      </Fade>
    </div>
  );
};
