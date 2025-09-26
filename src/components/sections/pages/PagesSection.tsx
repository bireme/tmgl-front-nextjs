import { Container, LoadingOverlay } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../../styles/components/sections.module.scss";

export interface PagesSectionProps {
  countryId?: number;
  region?: string;
  className?: string;
}

export const PagesSection = ({
  countryId,
  region,
  className,
}: PagesSectionProps) => {
  const [pages, setPages] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const _api = new PostsApi(region); // Usar API regional
  
  const getPages = useCallback(async () => {
    if (!countryId) {
      console.log("No countryId provided");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Searching for pages with countryId:", countryId, "in region:", region);
      const resp = await _api.getCustomPost(
        "pages",
        50, // Buscar mais páginas para ter todas
        undefined,
        undefined,
        undefined,
        { countryId: [countryId] }
      );
      console.log("Found pages:", resp.length, resp);
      setPages(resp);
    } catch (error: any) {
      console.log("Error while getting pages", error);
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
        backgroundImage: `url(${pages[0]._embedded?.['wp:featuredmedia']?.[0]?.source_url || ""})`
      }}
      className={`${styles.PagesSection} ${className || ""}`}
    >
      {pages.map((page, index) => (
        <Container key={page.id} size="xl" className={styles.PageContainer}>
          <h3 className={styles.TitleWithIcon}>
            {page.title.rendered}
          </h3>
          <div 
            className="post-content"
            dangerouslySetInnerHTML={{
              __html: page.content?.rendered || "",
            }}
          />
        </Container>
      ))}
    </div>
  );
};
