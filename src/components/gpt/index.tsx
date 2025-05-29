import { Modal } from "@mantine/core";
import styles from "../../styles/components/gpt.module.scss";
import { useState } from "react";

export const GptWidget = () => {
  return (
    <>
      <div
        onClick={() => {
          window.open(
            "https://chatgpt.com/g/g-2rwZEsuEj-tmgl-gpt-the-integrative-public-health-model",
            "_blank"
          );
        }}
        className={styles.GptWidget}
      >
        Talk with an assistent
      </div>
    </>
  );
};
