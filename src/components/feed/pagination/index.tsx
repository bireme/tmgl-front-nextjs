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
  // currentIndex agora é baseado em 0 (0, 1, 2, ...)
  // mas exibimos baseado em 1 (1, 2, 3, ...)
  const displayIndex = currentIndex + 1;
  
  return (
    <Flex className={styles.Pagination} gap={5} wrap={"wrap"}>
      <a
        className={currentIndex <= 0 ? styles.disabled : ""}
        onClick={() => {
          if (currentIndex > 0) {
            callBack(currentIndex - 1);
          }
        }}
      >
        Prev{" "}
      </a>
      {Array.from(
        { length: totalPages ? (totalPages > 100 ? 100 : totalPages) : 1 },
        (_, i) => i
      ).map((i) => {
        return (
          <a
            key={i}
            onClick={() => callBack(i)}
            className={i === currentIndex ? styles.active : ""}
          >
            {i + 1}
          </a>
        );
      })}
      <a
        className={currentIndex >= totalPages - 1 ? styles.disabled : ""}
        onClick={() => {
          if (currentIndex < totalPages - 1) {
            callBack(currentIndex + 1);
          }
        }}
      >
        Next
      </a>
    </Flex>
  );
};
