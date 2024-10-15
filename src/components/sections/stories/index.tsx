import { BackgroundImage, Button, Flex, Grid } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import styles from "../../../styles/components/sections.module.scss";

export interface StoreisSectionProps {
  imagePath: string;
  title: string;
  href?: string;
  excerpt?: string;
  main?: boolean;
}
export const StoriesItem = ({
  imagePath,
  title,
  href,
  excerpt,
  main,
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
          <h2>{title}</h2>
          {main ? (
            <div dangerouslySetInnerHTML={{ __html: excerpt ? excerpt : "" }} />
          ) : (
            <></>
          )}
          <Button mt={10}>
            <a href={href}>Read full story</a>
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export interface StoriesSectionProps {
  region: string;
}
export const StoriesSection = ({ region }: StoriesSectionProps) => {
  const [posts, setPosts] = useState<Array<Post>>();
  const _api = new PostsApi();

  //Realizar a Filtragem a partir do region
  const getFeaturedStories = useCallback(async () => {
    try {
      const result = await _api.getCustomPost("featured_stories", 3);
      setPosts(result);
    } catch (error: any) {
      console.log("Error while trying to get Featured Stories: ", error);
    }
  }, []);

  useEffect(() => {
    getFeaturedStories();
  }, [getFeaturedStories]);

  return (
    <>
      <h2 className={styles.TitleWithIcon}>
        <img src={"/local/svg/simbol.svg"} /> Featured Stories
      </h2>
      {posts ? (
        posts.length > 0 ? (
          <>
            <Grid my={50}>
              <Grid.Col span={{ md: 8 }}>
                <StoriesItem
                  main
                  imagePath={_api.findFeaturedMedia(posts[0], "large")}
                  title={posts[0].title.rendered}
                  excerpt={posts[0].excerpt.rendered}
                  href={`/featured-stories/${posts[0].slug}`}
                />
              </Grid.Col>
              <Grid.Col span={{ md: 4 }}>
                <StoriesItem
                  imagePath={_api.findFeaturedMedia(posts[1], "medium")}
                  title={posts[1].title.rendered}
                  excerpt={posts[1].excerpt.rendered}
                  href={`/featured-stories/${posts[1].slug}`}
                />
                <StoriesItem
                  imagePath={_api.findFeaturedMedia(posts[2], "medium")}
                  title={posts[2].title.rendered}
                  excerpt={posts[2].excerpt.rendered}
                  href={`/featured-stories/${posts[2].slug}`}
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
