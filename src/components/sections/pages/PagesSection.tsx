import { Button, Container, LoadingOverlay } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../../styles/components/sections.module.scss";

export interface PagesSectionProps {
  region?: string;
  className?: string;
  countrySlug?: string;
  buttonLabel?: string;
}

export const PagesSection = ({
  region,
  className,
  countrySlug,
  buttonLabel,
}: PagesSectionProps) => {
  const [pages, setPages] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState<number | undefined>(undefined);
  const _api = new PostsApi(region); // Usar API regional

  const getPages = useCallback(async () => {
    if (!countryId && countrySlug) {
      const countryTerms = await _api.getCountryBySlug(countrySlug);
      setCountryId(countryTerms[0].id);
    }

    setLoading(true);
    if (countryId) {
      try {
        const resp = await _api.getCustomPost(
          "pages",
          50, // Buscar mais páginas para ter todas
          undefined,
          undefined,
          undefined,
          { countryId: [countryId] }
        );
        setPages(resp);
        console.log(resp);
      } catch (error: any) {}
    }
    setLoading(false);
  }, [countryId, region]);

  useEffect(() => {
    getPages();
  }, [getPages]);

  if (loading) {
    return (
      <div style={{ height: "200px", position: "relative" }}>
        <LoadingOverlay visible={true} />
      </div>
    );
  }

  if (pages.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundImage: `url(${
          pages[0]._embedded?.["wp:featuredmedia"]?.[0]?.source_url || ""
        })`,
      }}
      className={`${styles.PagesSection} ${className || ""}`}
    >
      {pages.map((page, index) => (
        <Container key={page.id} size="xl" className={styles.PageContainer}>
          <h3 className={styles.TitleWithIcon}>{page.title.rendered}</h3>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: page.content?.rendered.split("</p>")[0] || "",
            }}
          />
          <Button
            size={"md"}
            onClick={() =>
              window.open(
                process.env.BASE_URL + "/" + region + "/content/" + page.slug
              )
            }
          >
            {buttonLabel ? buttonLabel : "Read more"}
          </Button>
        </Container>
      ))}
    </div>
  );
};