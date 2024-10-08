import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";
import { useState } from "react";

export default function RegionHome() {
  const router = useRouter();
  const {
    query: { region },
  } = router;

  const [sliderImages, setSliderImages] = useState<Array<string>>();

  return (
    <>
      <div className={styles.HeroSearch}></div>
    </>
  );
}
