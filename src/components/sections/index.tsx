import { useCallback, useEffect, useState } from "react";

import { Flex } from "@mantine/core";
import { Post } from "@/services/types/posts.dto";
import { PostsApi } from "@/services/posts/PostsApi";
import { decodeHtmlEntities } from "@/helpers/stringhelper";
import styles from "../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

export interface TraditionalSectionCardProps {
  iconPath: string;
  title: string;
  target?: string;
}
export const TraditionalSectionCard = ({
  iconPath,
  title,
  target,
}: TraditionalSectionCardProps) => {
  const router = useRouter();
  return (
    <Flex
      p={"30px"}
      className={styles.TraditionalSection}
      onClick={() => {
        router.push(target ? target : "");
      }}
      justify={"center"}
      align={"center"}
      direction={"column"}
    >
      <img src={iconPath} />
      <p>{decodeHtmlEntities(title)}</p>
    </Flex>
  );
};

export const DimensionsSection = () => {
  const [posts, setPosts] = useState<Array<Post>>();
  const _api = new PostsApi();
  const getDimensions = useCallback(async () => {
    try {
      const result = await _api.getCustomPost("dimensions");
      setPosts(result);
    } catch (error: any) {
      console.log("Error while trying to get Dimensions: ", error);
    }
  }, []);

  useEffect(() => {
    getDimensions();
  }, [getDimensions]);

  return (
    <>
      <Flex
        mt={80}
        direction={{ base: "row" }}
        wrap={"wrap"}
        gap={{ md: 80, base: 20 }}
        justify={"center"}
        align={"center"}
      >
        {posts?.map((dimension, key) => {
          return (
            <TraditionalSectionCard
              key={key}
              iconPath={_api.findFeaturedMedia(dimension, "full")}
              target={`/dimensions/${dimension.slug}`}
              title={dimension.title.rendered}
            />
          );
        })}
      </Flex>
    </>
  );
};
