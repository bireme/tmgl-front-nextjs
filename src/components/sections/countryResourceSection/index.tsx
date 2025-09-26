import { Container } from "@mantine/core";

import { CountryAcfResource } from "@/services/types/posts.dto";
import { decodeHtmlLink } from "@/helpers/stringhelper";
import styles from "@/styles/pages/home.module.scss";

interface CountryResourceSectionProps {
  resources?: CountryAcfResource[];
  title?: string;
}

export function CountryResourceSection({
  resources,
  title = "Resources",
}: CountryResourceSectionProps) {
  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <div className={styles.CountryRersources}>
      <Container py={60} size={"xl"}>
        <h3 className={styles.TitleWithIcon}>{title}</h3>
        <div className={styles.ResourcesGrid}>
          {resources.map((resource: CountryAcfResource, index: number) => {
            return (
              <div key={index} className={styles.ResourceItem}>
                <div
                  className={styles.ResourceCard}
                  onClick={() =>
                    window.open(decodeHtmlLink(resource.url), "_blank")
                  }
                >
                  <div className={styles.ResourceIcon}>
                    <img
                      src={resource.icon}
                      alt={resource.title}
                      className={styles.ResourceIconImage}
                    />
                  </div>
                  <h4 className={styles.ResourceTitle}>
                    {resource.title}
                  </h4>
                  <div className={styles.ResourceBottomBar} />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
