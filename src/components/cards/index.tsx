import { Flex } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";
import styles from "../../../styles/components/cards.module.scss";

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
    >
      <Flex className={styles.cardIcon}>{icon}</Flex>
      <Flex className={styles.cardContent}>{title}</Flex>
    </Flex>
  );
};
