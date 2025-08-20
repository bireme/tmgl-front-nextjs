import { Flex, Text } from "@mantine/core";

import Link from "next/link";
import { ReactNode } from "react";
import styles from "../../styles/components/cards.module.scss";

export interface IconCardProps {
  title: string;
  icon: ReactNode;
  callBack?: Function;
  small?: boolean;
}
export const IconCard = ({ callBack, title, icon, small }: IconCardProps) => {
  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"center"}
      className={`${styles.IconCard} ${small ? styles.Small : ""}`}
      onClick={() => {
        callBack ? callBack() : null;
      }}
      gap={"10%"}
      mb={"40px"}
    >
      <Flex direction={"column"} justify={"center"} className={styles.cardIcon}>
        {icon}
      </Flex>
      <Flex
        className={styles.cardContent}
        direction={"column"}
        justify={"center"}
      >
        {title}
      </Flex>
    </Flex>
  );
};

export const ImageCard = ({ callBack, title, icon, small }: IconCardProps) => {
  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"center"}
      className={`${styles.IconCard} ${small ? styles.Small : ""}`}
      onClick={() => {
        callBack ? callBack() : null;
      }}
      gap={"10%"}
      mb={"40px"}
    >
      <Flex
        direction={"column"}
        justify={"center"}
        className={styles.cardImage}
      >
        {icon}
      </Flex>

      <Text
        className={styles.cardTitle}
        ta={"left"}
        style={{ width: "100%", fontWeight: "bold" }}
      >
        {title}
      </Text>
    </Flex>
  );
};
