import { ReactNode } from "react";
import styles from "../../styles/components/video.module.scss";
const video = "/local/video/bg.mp4";

type CustomComponentProps = {
  children: ReactNode;
};
export const VideoSection = ({ children }: CustomComponentProps) => {
  return (
    <div className={styles.VideoSection}>
      <video autoPlay loop muted id={"video"} className={styles.Video}>
        <source src={video} type={"video/mp4"}></source>
      </video>
      <div className={styles.Content}>{children}</div>
    </div>
  );
};
