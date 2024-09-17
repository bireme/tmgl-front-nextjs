import { Flex } from "@mantine/core";
import { ReactNode } from "react";
import styles from "../../styles/components/sections.module.scss";
import { useRouter } from "next/router";

export interface TraditionalSectionCardProps {
  iconPath: string;
  title: ReactNode;
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
      <p>{title}</p>
    </Flex>
  );
};
