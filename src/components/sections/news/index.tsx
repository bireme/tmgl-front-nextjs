import { Badge, Flex } from "@mantine/core";

import moment from "moment";
import styles from "../../../styles/components/sections.module.scss";

export interface NewsItemProps {
  imagePath: string;
  date: Date;
  title: string;
  category?: string;
}
export const NewsItem = ({
  imagePath,
  date,
  title,
  category,
}: NewsItemProps) => {
  return (
    <Flex className={styles.NewsItem} direction={"column"} justify={"start"}>
      <div
        className={styles.NewsImage}
        style={{ backgroundImage: `url(${imagePath})` }}
      ></div>
      <Flex
        direction={"column"}
        justify={"space-between"}
        className={styles.NewsContent}
      >
        <div>
          <p>
            <small>{moment(date).format("DD MMM [,] YYYY")}</small>
          </p>
          <h3>{title}</h3>
        </div>
        <Badge color={"tmgl-red"} style={{ fontWeight: 400 }} px={15} py={10}>
          {category}
        </Badge>
      </Flex>
    </Flex>
  );
};
