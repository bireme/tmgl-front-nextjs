import { Button, Flex, TreeNodeData } from "@mantine/core";

import { IconArrowRight } from "@tabler/icons-react";
import styles from "../../../styles/components/sections.module.scss";

export interface TrentingTopicProps {
  title: string;
  excerpt: string;
  href: string;
}
export const TrendingTopicSection = ({
  title,
  excerpt,
  href,
}: TrentingTopicProps) => {
  return (
    <Flex
      className={styles.TrendingTopicSection}
      direction={"column"}
      justify={"space-between"}
    >
      <div className={styles.TrendingText}>
        <h3>{title}</h3>
        <p>{excerpt}</p>
      </div>
      <div className={styles.TrendingLink}>
        <a href={href} className={styles.TrendingButton}>
          <Button p={8} radius={"md"} size={"sm"}>
            <IconArrowRight size={19} stroke={1.5} />
          </Button>
        </a>
      </div>
    </Flex>
  );
};
