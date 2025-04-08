import { Flex } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import styles from "../../styles/components/cards.module.scss";

export interface IconCardProps {
  title: string;
  icon: ReactNode;
  callBack?: Function;
}
export const IconCard = ({ callBack, title, icon }: IconCardProps) => {
  return (
    <Flex
      className={styles.IconCard}
      onClick={() => {
        callBack ? callBack() : null;
      }}
      gap={"10%"}
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
