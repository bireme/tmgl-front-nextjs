import { BackgroundImage, Button, Flex } from "@mantine/core";

import styles from "../../../styles/components/sections.module.scss";

export interface StoreisSectionProps {
  imagePath: string;
  title: string;
  href?: string;
  excerpt?: string;
  main?: boolean;
}
export const StoriesSection = ({
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
            <>
              <p>{excerpt}</p>
            </>
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
