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
  path: Array<string>;
  type: string;
}
export const HeroHeader = ({ post, path, type }: HeroHeaderProps) => {
  const [background, setBackground] = useState<string>();
  const [acfs, setAcfs] = useState<DimensionsAcf>();
  const _mediaApi = new MediaApi();

  const getBackground = useCallback(async () => {
    //May we can change dimensions to use featured image than acf.
    if (type == "TM Dimensions") {
      const acfs = post.acf as unknown as DimensionsAcf;
      setBackground(acfs.cover_image.url);
      setAcfs(acfs);
    } else {
      setBackground(_mediaApi.findFeaturedMedia(post, "full"));
    }
  }, []);
  useEffect(() => {
    getBackground();
  }, [getBackground]);

  return (
    <div
      className={styles.HeroHeader}
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .8), rgba(0, 0, 0, 0)),url(${background})`,
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
              path={path.concat([
                acfs?.long_title
                  ? acfs.long_title
                  : post.title
                  ? post.title.rendered
                  : "",
              ])}
            />
          </div>
          <div>
            <h2 className={styles.TitleWithIcon}>{type}</h2>
            <h1>
              {acfs?.long_title
                ? acfs?.long_title
                : post.title
                ? post.title.rendered
                : ""}
            </h1>
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
