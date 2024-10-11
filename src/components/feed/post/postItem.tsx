import { Button, Flex } from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";
import styles from "../../../styles/components/feed.module.scss";

export interface PostItemProps {
  title: string;
  excerpt: string;
  href: string;
  thumbnail: string;
}

export const PostItem = ({
  title,
  excerpt,
  href,
  thumbnail,
}: PostItemProps) => {
  return (
    <Flex
      className={styles.PostItem}
      direction={"column"}
      align={"flex-end"}
      justify={"space-between"}
    >
      <div
        className={styles.PostImage}
        style={{
          backgroundImage: `url(${thumbnail})`,
        }}
      ></div>
      <div className={styles.PostContent}>
        <h3>{title}</h3>
        <div dangerouslySetInnerHTML={{ __html: excerpt }}></div>
      </div>
      <Button size={"sm"}>
        {" "}
        <IconArrowRight />{" "}
      </Button>
    </Flex>
  );
};
