import { Badge, Button, Flex } from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";
import styles from "../../../styles/components/feed.module.scss";
import { useRouter } from "next/router";

export interface PostItemProps {
  title: string;
  excerpt: string;
  href: string;
  thumbnail: string;
  tags?: Array<string>;
}

export const PostItem = ({
  title,
  excerpt,
  href,
  thumbnail,
  tags,
}: PostItemProps) => {
  const router = useRouter();
  return (
    <Flex
      onClick={() => router.push(href)}
      className={styles.PostItem}
      direction={"column"}
      align={"flex-end"}
      justify={"space-between"}
    >
      {thumbnail && thumbnail != "" ? (
        <div
          className={styles.PostImage}
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
        ></div>
      ) : (
        ""
      )}

      <div className={styles.PostContent}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: excerpt }}></div>
      </div>
      <Flex>
        {tags?.map((tag, key) => (
          <Badge
            key={key}
            color={"tmgl-red"}
            style={{ fontWeight: 400 }}
            px={15}
            py={10}
          >
            {tag}
          </Badge>
        ))}
      </Flex>
    </Flex>
  );
};
