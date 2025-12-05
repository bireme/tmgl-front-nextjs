import styles from "../../styles/components/skip-link.module.scss";

export const SkipLink = () => {
  return (
    <a href="#main-content" className={styles.skipLink}>
      Pular para o conteúdo principal
    </a>
  );
};

