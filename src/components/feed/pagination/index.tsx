import { Dispatch, SetStateAction } from "react";

import { Flex } from "@mantine/core";
import styles from "../../../styles/components/resources.module.scss";

export interface PaginationProps {
  currentIndex: number;
  totalPages: number;
  callBack: Dispatch<SetStateAction<number>>;
}
export const Pagination = ({
  currentIndex,
  totalPages,
  callBack,
}: PaginationProps) => {
  return (
    <Flex className={styles.Pagination} gap={5} wrap={"wrap"}>
      <a
        className={currentIndex - 1 < 1 ? styles.disabled : ""}
        onClick={() => {
          callBack(currentIndex - 1);
        }}
      >
        Prev{" "}
      </a>
      {Array.from(
        { length: totalPages ? (totalPages > 100 ? 100 : totalPages) : 1 },
        (_, i) => i + 1
      ).map((i, k) => {
        return (
          <a
            key={k}
            onClick={() => callBack(i)}
            className={i == currentIndex ? styles.active : ""}
          >
            {i}
          </a>
        );
      })}
      <a
        className={currentIndex + 1 > totalPages ? styles.disabled : ""}
        onClick={() => {
          callBack(currentIndex + 1);
        }}
      >
        Next
      </a>
    </Flex>
  );
};
