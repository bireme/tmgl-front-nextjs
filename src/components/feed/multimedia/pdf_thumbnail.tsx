import { LoadingOverlay } from "@mantine/core";
import styles from "../../../styles/components/resources.module.scss";
import { useState } from "react";

export const IframeThumbNail = ({
  url,
  height,
}: {
  url: string;
  height?: string;
}) => {
  const [loading, setLoading] = useState(true);
  return (
    <div
      className={styles.iframeBlocker}
      style={{ height: height ? height : "auto" }}
    >
      <iframe
        onLoad={() => setLoading(false)}
        src={url + "?toolbar=0&navpanes=0"}
      />
      {loading && (
        <div className={styles.iframeLoader}>
          <LoadingOverlay visible={loading} />
        </div>
      )}
      <div className={`${styles.block} ${height ? styles.blockTop : ""}`}></div>
    </div>
  );
};
