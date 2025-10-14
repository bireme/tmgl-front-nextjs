import { BackgroundImage, Button, Flex, Grid } from "@mantine/core";
import { GetCustomPostOptions, PostsApi } from "@/services/posts/PostsApi";
import { useCallback, useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/contexts/globalContext";
import { Post } from "@/services/types/posts.dto";
import { lang } from "moment";
import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../../styles/components/sections.module.scss";

export interface StoreisSectionProps {
  imagePath: string;
  title: string;
  href?: string;
  excerpt?: string;
  main?: boolean;
  buttonLabel?: string;
}
export const StoriesItem = ({
  imagePath,
  title,
  href,
  excerpt,
  main,
  buttonLabel,
}: StoreisSectionProps) => {
  return (
    <div className={`${styles.StoreisSection} ${main ? styles.main : ""}`}>
      <div
        className={styles.StoreisSectionContainer}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, .8), rgba(0, 0, 0, 0)), url(${imagePath})`,
        }}
      >
        <Flex
          direction={"column"}
          className={styles.Content}
          align={"flex-start"}
          gap={10}
        >
          <h2>
            {!main ? removeHTMLTagsAndLimit(title, 80) : title}{" "}
            {title.length > 80 && !main ? "..." : ""}
          </h2>
          {main ? (
            <div dangerouslySetInnerHTML={{ __html: excerpt ? excerpt : "" }} />
          ) : (
            <></>
          )}
          <Button mt={10}>
            <a href={href} target="">{buttonLabel ? buttonLabel : "Read full story"}</a>
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export interface StoriesSectionProps {
  regionApi?: string;
  region?: string;
  fetchOptions?: GetCustomPostOptions;
  title?: string;
  buttonLabel?: string;
}
export const StoriesSection = ({
  regionApi,
  region,
  fetchOptions,
  title,
  buttonLabel,
}: StoriesSectionProps) => {
  const [posts, setPosts] = useState<Array<Post>>();
  const _api = new PostsApi(regionApi ? regionApi : undefined);

  //Realizar a Filtragem a partir do region
  const getFeaturedStories = useCallback(async () => {
    try {
      let result;
      if (!fetchOptions) {
        result = await _api.getCustomPost(
          "featured_stories",
          3,
          undefined,
          undefined,
          !regionApi ? region : undefined
        );
      } else {
        result = await _api.getCustomPost(
          "featured_stories",
          3,
          undefined,
          undefined,
          !regionApi ? region : undefined,
          fetchOptions
        );
      }
      setPosts(result);
      console.log(result);
    } catch (error: any) {}
  }, []);

  useEffect(() => {
    getFeaturedStories();
  }, [getFeaturedStories]);

  return (
    <>
      {posts ? (
        posts.length >= 3 ? (
          <>
            <h2 className={`${styles.TitleWithIcon} ${styles.center}`}>
              {title ? title : "Featured Stories"}
            </h2>
            <Grid my={50}>
              <Grid.Col span={{ md: 8 }}>
                <StoriesItem
                  main
                  buttonLabel={buttonLabel}
                  imagePath={_api.findFeaturedMedia(posts[0], "large")}
                  title={posts[0].title.rendered}
                  excerpt={posts[0].excerpt.rendered}
                  href={`${regionApi ?  "/"+regionApi : ""}/featured-stories/${posts[0].slug}`}
                />
              </Grid.Col>
              <Grid.Col span={{ md: 4 }}>
                <StoriesItem
                  buttonLabel={buttonLabel}
                  imagePath={_api.findFeaturedMedia(posts[1], "medium")}
                  title={posts[1].title.rendered}
                  excerpt={posts[1].excerpt.rendered}
                  href={`${regionApi ? "/"+regionApi : ""}/featured-stories/${posts[1].slug}`}
                />
                <StoriesItem
                  buttonLabel={buttonLabel}
                  imagePath={_api.findFeaturedMedia(posts[2], "medium")}
                  title={posts[2].title.rendered}
                  excerpt={posts[2].excerpt.rendered}
                  href={`${regionApi ?  "/"+regionApi : ""}/featured-stories/${posts[2].slug}`}
                />
              </Grid.Col>
            </Grid>
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </>
  );
};

// Export the ManualStoriesSection component
export { ManualStoriesSection } from "./ManualStoriesSection";
