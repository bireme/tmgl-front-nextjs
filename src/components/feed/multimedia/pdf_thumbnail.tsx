import Image from "next/image";
import { LoadingOverlay } from "@mantine/core";
import styles from "../../../styles/components/resources.module.scss";
import { useState } from "react";

export const IframeThumbNail = ({
  url,
  height,
  type,
}: {
  url: string;
  height?: string;
  type?: string;
}) => {
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  return (
    <div
      className={styles.iframeBlocker}
      style={{ height: height ? height : "auto" }}
    >
      {loadFailed ? (
        <Image src={"/local/png/pdf.png"} alt="PDF preview unavailable" width={400} height={300} style={{ height: "auto" }} />
      ) : (
        <iframe
          title="PDF preview"
          loading="lazy"
          onError={() => { setLoadFailed(true); setLoading(false); }}
          onLoad={() => setLoading(false)}
          src={`/api/proxy-pdf?url=${encodeURIComponent(url)}${
            type ? `&type=${encodeURIComponent(type)}` : ""
          }`}
        />
      )}

      {loading && (
        <div className={styles.iframeLoader}>
          <LoadingOverlay visible={loading} />
        </div>
      )}
      <div className={`${styles.block} ${height ? styles.blockTop : ""}`}></div>
    </div>
  );
};
