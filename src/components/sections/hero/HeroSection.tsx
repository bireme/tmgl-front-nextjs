import { Container } from "@mantine/core";
import { BreadCrumbs } from "@/components/breadcrumbs";
import { HeroSlider } from "@/components/slider";
import { SearchForm } from "@/components/forms/search";
import { AcfImageArray } from "@/services/types/featuredStoriesAcf";
import styles from "../../../styles/pages/home.module.scss";

interface BreadcrumbItem {
  path: string;
  name: string;
}

interface HeroSectionProps {
  sliderImages?: AcfImageArray[] | string[];
  breadcrumbs: BreadcrumbItem[];
  searchTitle?: string;
  searchSubtitle?: string;
  small?: boolean;
  blackColor?: boolean;
  className?: string;
}

export function HeroSection({
  sliderImages,
  breadcrumbs,
  searchTitle,
  searchSubtitle,
  small = false,
  blackColor = false,
  className,
}: HeroSectionProps) {
  return (
    <div className={`${styles.HeroSearch} ${small ? styles.small : ""} ${className || ""}`}>
      {sliderImages && sliderImages.length > 0 && (
        <HeroSlider images={sliderImages as (AcfImageArray | undefined)[]} />
      )}

      <div className={styles.FullContainer}>
        <Container size={"xl"}>
          <br />
          <BreadCrumbs blackColor={blackColor} path={breadcrumbs} />
          <SearchForm
            small={small}
            title={searchTitle || ""}
            subtitle={searchSubtitle || ""}
          />
        </Container>
      </div>
    </div>
  );
}
