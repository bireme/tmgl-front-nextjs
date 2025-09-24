import { Container, Flex } from "@mantine/core";
import { IconCard, ImageCard } from "@/components/cards";
import { decodeHtmlLink } from "@/helpers/stringhelper";
import styles from "../../../styles/pages/home.module.scss";

interface ResourceItem {
  title: string;
  url: string;
  image: string;
}

interface SimilarTheme extends ResourceItem {
  // Similar themes use ImageCard
}

interface ResourcesSectionProps {
  similarThemes?: SimilarTheme[];
  similarThemesTitle?: string;
  resources?: ResourceItem[];
  resourcesTitle?: string;
  className?: string;
}

export function ResourcesSection({
  similarThemes,
  similarThemesTitle,
  resources,
  resourcesTitle,
  className,
}: ResourcesSectionProps) {
  return (
    <div className={`${styles.CountryRersources} ${className || ""}`}>
      {/* Similar Themes Section */}
      {similarThemes && similarThemes.length > 0 && (
        <Container py={40} size={"xl"}>
          <h3 className={styles.TitleWithIcon}>
            {similarThemesTitle || "Related Themes"}
          </h3>
          <Flex
            mt={50}
            gap={{ base: "20px", md: "3%" }}
            justify={"space-around"}
            direction={{ base: "column", sm: "row" }}
            wrap={"wrap"}
          >
            {similarThemes.map((theme, index) => {
              return (
                <ImageCard
                  title={theme.title}
                  icon={
                    <>
                      <div
                        className={styles.imageCardImage}
                        style={{
                          backgroundImage: `url(${theme.image})`,
                        }}
                      />
                    </>
                  }
                  callBack={() =>
                    window.open(decodeHtmlLink(theme.url), "_blank")
                  }
                  key={index}
                />
              );
            })}
          </Flex>
        </Container>
      )}

      {/* Resources Section */}
      {resources && resources.length > 0 && (
        <Container py={40} size={"xl"}>
          <h3 className={styles.TitleWithIcon}>
            {resourcesTitle || "Resources"}
          </h3>
          <Flex
            mt={50}
            gap={{ base: "20px", md: "3%" }}
            justify={"space-around"}
            direction={{ base: "column", sm: "row" }}
            wrap={"wrap"}
          >
            {resources.map((resource, index) => {
              return (
                <IconCard
                  title={resource.title}
                  icon={
                    <>
                      <img src={resource.image} alt={resource.title} />
                    </>
                  }
                  callBack={() =>
                    window.open(decodeHtmlLink(resource.url), "_blank")
                  }
                  key={index}
                />
              );
            })}
          </Flex>
        </Container>
      )}
    </div>
  );
}
