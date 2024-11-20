import { Badge, Container, Flex } from "@mantine/core";
import { BreadCrumbs, pathItem } from "@/components/breadcrumbs";
import { useCallback, useContext, useEffect, useState } from "react";

import { CustomTaxBadge } from "@/components/categories";
import { DimensionsAcf } from "@/services/types/dimensionsAcf";
import { GlobalContext } from "@/contexts/globalContext";
import { MediaApi } from "@/services/media/MediaApi";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { colors } from "@/helpers/colors";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../../styles/components/sections.module.scss";

export interface HeroHeaderProps {
  post: Post;
  path: Array<pathItem>;
  type: string;
}

export const HeroHeader = ({ post, path, type }: HeroHeaderProps) => {
  const [background, setBackground] = useState<string>();
  const [acfs, setAcfs] = useState<DimensionsAcf>();
  const _mediaApi = new MediaApi();
  const _postApi = new PostsApi();
  const categories = _postApi.getPostCategories(post);

  const getBackground = useCallback(async () => {
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
            <BreadCrumbs path={path} />
          </div>
          <div>
            <h2 className={styles.TitleWithIcon}>{type}</h2>
            <h1>
              {acfs?.long_title
                ? acfs?.long_title
                : post.title
                ? decodeHtmlEntities(post.title.rendered)
                : ""}
            </h1>
            <div
              className={styles.Excerpt}
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            <CustomTaxBadge names={[type]} />
          </div>
        </Flex>
      </Container>
    </div>
  );
};
