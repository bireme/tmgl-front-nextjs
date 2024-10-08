import { useCallback, useEffect, useState } from "react";

import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import { Container } from "@mantine/core";
import { HeroSlider } from "@/components/slider";
import { HomeAcf } from "@/services/types/homeAcf.dto";
import { PagesApi } from "@/services/pages/PagesApi";
import { RegionalDimensions } from "@/components/sections/dimensions";
import { SearchForm } from "@/components/forms/search";
import styles from "../../styles/pages/home.module.scss";
import { useRouter } from "next/router";

export default function RegionHome() {
  const router = useRouter();
  const [sliderImages, setSliderImages] = useState<Array<AcfImageArray>>();
  const [acf, setAcf] = useState<HomeAcf>();
  const {
    query: { region },
  } = router;

  const getPageProperties = useCallback(async () => {
    const _api = new PagesApi(region ? region.toString() : "");
    try {
      const resp = await _api.getPageProperties("home");
      setAcf(resp[0].acf);
      setSliderImages(resp[0].acf.search.slider_images);
    } catch {
      console.log("Error while get home properties");
    }
  }, [region]);

  useEffect(() => {
    getPageProperties();
  }, [getPageProperties]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <div className={styles.HeroSearch}>
        {sliderImages ? <HeroSlider images={sliderImages} /> : <></>}
        <div className={styles.FullContainer}>
          <Container size={"xl"}>
            <SearchForm
              title={acf?.search.title ? acf?.search.title : ""}
              subtitle={acf?.search.subtitle ? acf.search.subtitle : ""}
            />
          </Container>
        </div>
      </div>
      <div>
        {acf ? (
          <>
            <RegionalDimensions
              acf={acf}
              region={region ? region.toString() : ""}
            />
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
