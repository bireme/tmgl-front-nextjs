import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import { Document, Page } from "react-pdf";

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
        <img src={"/local/png/pdf.png"} />
      ) : (
        <iframe
          onError={() => setLoadFailed(true)}
          onLoad={() => setLoading(false)}
          src={`/api/proxy-pdf?url=${encodeURIComponent(url)}${
            type ? `&type=${type}` : ""
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

export default function PdfThumbnail({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={styles.iframeBlocker}>
      <Document file={url} onLoadSuccess={() => setLoaded(true)}>
        <Page
          pageNumber={1}
          width={300}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {!loaded && (
        <div className={styles.iframeLoader}>
          <LoadingOverlay visible />
        </div>
      )}
      <div className={`${styles.block}`}></div>
    </div>
  );
}
