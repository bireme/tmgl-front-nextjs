import { Container, Flex } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { BreadCrumbs } from "@/components/breadcrumbs";
import { DimensionsAcf } from "@/services/types/dimensionsAcf";
import { MediaApi } from "@/services/media/MediaApi";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../../styles/components/sections.module.scss";

export interface HeroHeaderProps {
  post: Post;
}
export const HeroHeader = ({ post }: HeroHeaderProps) => {
  const [background, setBackground] = useState<string>();
  const [acfs, setAcfs] = useState<DimensionsAcf>();
  const _api = new PostsApi();
  const _mediaApi = new MediaApi();

  const getBackground = useCallback(async () => {
    const acfs = post.acf as unknown as DimensionsAcf;
    setAcfs(acfs);
    setBackground(await _mediaApi.getMediaById(acfs.cover_image));
  }, []);
  useEffect(() => {
    getBackground();
  }, [getBackground]);

  return (
    <div
      className={styles.HeroHeader}
      style={{
        backgroundImage: `url(${background})`,
      }}
    >
      <Container size={"xl"}>
        <Flex
          direction={"column"}
          justify={"space-between"}
          className={styles.HeroContent}
        >
          <div>
            <BreadCrumbs
              path={[
                "TMGL",
                "TM Dimensions",
                acfs?.long_title ? acfs.long_title : "",
              ]}
            />
          </div>
          <div>
            <h2 className={styles.TitleWithIcon}>TM Dimensions</h2>
            <h1>{acfs?.long_title}</h1>
            <div
              className={styles.Excerpt}
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
          </div>
        </Flex>
      </Container>
    </div>
  );
};
