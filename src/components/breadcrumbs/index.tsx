import { removeHTMLTagsAndLimit } from "@/helpers/stringhelper";
import styles from "../../styles/components/breadcrumbs.module.scss";
import { useRouter } from "next/router";

export interface pathItem {
  name: string;
  path: string;
}

interface BreadCrumbsProps {
  path: Array<pathItem>;
  blackColor?: boolean;
}

export const BreadCrumbs = ({ path, blackColor }: BreadCrumbsProps) => {
  const router = useRouter();
  return (
    <div
      className={`${styles.BreadCrumbs} ${blackColor ? styles.blackColor : ""}`}
    >
      {path.map((item, key) => {
        return (
          <a key={key} href={`${item.path}`}>
            <span>
              {removeHTMLTagsAndLimit(item.name, 40)}
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
