import { Grid } from "@mantine/core";
import { ResumedPost } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { StoriesItem } from "./index";
import { useEffect, useState } from "react";
import styles from "../../../styles/components/sections.module.scss";

export interface ManualStoriesSectionProps {
  posts: Array<ResumedPost>;
  title?: string;
  buttonLabel?: string;
}

export const ManualStoriesSection = ({
  posts,
  title,
  buttonLabel,
}: ManualStoriesSectionProps) => {
  const [images, setImages] = useState<{ [key: number]: string }>({});
  const _api = new PostsApi();

  useEffect(() => {
    const fetchImages = async () => {
      const imagePromises = posts.slice(0, 3).map(async (post, index) => {
        const size = index === 0 ? "large" : "medium";
        const imageUrl = await _api.getFeaturedImageById(post.ID, size);
        return { postId: post.ID, imageUrl };
      });

      const results = await Promise.all(imagePromises);
      const imageMap: { [key: number]: string } = {};
      
      results.forEach(({ postId, imageUrl }) => {
        imageMap[postId] = imageUrl || "/local/png/defaultImage.png";
      });

      setImages(imageMap);
    };

    if (posts && posts.length >= 3) {
      fetchImages();
    }
  }, [posts]);

  return (
    <>
      {posts && posts.length >= 3 ? (
        <>
          <h2 className={`${styles.TitleWithIcon} ${styles.center}`}>
            {title ? title : "Featured stories"}
          </h2>
          <Grid my={50}>
            <Grid.Col span={{ md: 8 }}>
              <StoriesItem
                main
                buttonLabel={buttonLabel}
                imagePath={images[posts[0].ID] || "/local/png/defaultImage.png"}
                title={posts[0].post_title}
                excerpt={posts[0].post_excerpt}
                href={`/featured-stories/${posts[0].post_name}`}
              />
            </Grid.Col>
            <Grid.Col span={{ md: 4 }}>
              <StoriesItem
                buttonLabel={buttonLabel}
                imagePath={images[posts[1].ID] || "/local/png/defaultImage.png"}
                title={posts[1].post_title}
                excerpt={posts[1].post_excerpt}
                href={`/featured-stories/${posts[1].post_name}`}
              />
              <StoriesItem
                buttonLabel={buttonLabel}
                imagePath={images[posts[2].ID] || "/local/png/defaultImage.png"}
                title={posts[2].post_title}
                excerpt={posts[2].post_excerpt}
                href={`/featured-stories/${posts[2].post_name}`}
              />
            </Grid.Col>
          </Grid>
        </>
      ) : (
        <></>
      )}
    </>
  );
};
