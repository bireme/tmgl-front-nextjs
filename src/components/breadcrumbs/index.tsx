import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../styles/components/breadcrumbs.module.scss";

export interface pathItem {
  name: string;
  path: string;
}

interface BreadCrumbsProps {
  path: Array<pathItem>;
  blackColor?: boolean;
}

export const BreadCrumbs = ({ path, blackColor }: BreadCrumbsProps) => {
  return (
    <div
      className={`${styles.BreadCrumbs} ${blackColor ? styles.blackColor : ""}`}
    >
      {path.map((item, key) => {
        if (key === path.length - 1) {
          return (
            <span key={key} className={styles.current} aria-current="page">
              {removeHTMLTagsAndLimit(item.name, 40).replace("-", " ")}
              {item.name.length > 40 ? "..." : ""}
            </span>
          );
        }
        return (
          <a key={key} href={`${item.path}`}>
            <span>
              {removeHTMLTagsAndLimit(item.name, 40).replace("-", " ")}
              {item.name.length > 40 ? "..." : ""}
            </span>{" "}
            <span className={styles.separator}>
              {key < path.length - 1 ? ">" : ""}{" "}
            </span>
          </a>
        );
      })}
    </div>
  );
};
