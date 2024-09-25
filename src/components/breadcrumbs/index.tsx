import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../styles/components/breadcrumbs.module.scss";

interface BreadCrumbsProps {
  path: Array<string>;
  blackColor?: boolean;
}

export const BreadCrumbs = ({ path, blackColor }: BreadCrumbsProps) => {
  return (
    <div
      className={`${styles.BreadCrumbs} ${blackColor ? styles.blackColor : ""}`}
    >
      {path.map((item, key) => {
        return (
          <>
            <span key={key}>
              {removeHTMLTagsAndLimit(item, 40)}
              {item.length > 40 ? "..." : ""}
            </span>{" "}
            {key < path.length - 1 ? ">" : ""}{" "}
          </>
        );
      })}
    </div>
  );
};
