import { IconMessageChatbot, IconShieldCheck } from "@tabler/icons-react";
import styles from "../../styles/components/gpt.module.scss";
import { Modal } from "@mantine/core";
import { useContext, useState } from "react";
import { GlobalContext } from "@/contexts/globalContext";

const disclaimerUrl = process.env.NEXT_PUBLIC_DISCLAIMER_CONTENT?.trim() ||
  "https://tmgl.org/content/privacy-policy-terms-and-conditions-of-use";

export const GptWidget = () => {
  const { globalConfig } = useContext(GlobalContext);
  const [opened, setOpened] = useState(false);

  return (
    <>
      <nav className={styles.SideLinks} aria-label="Help and policies">
        <a
          className={`${styles.SideLink} ${styles.Assistant}`}
          href="https://chatgpt.com/g/g-2rwZEsuEj-tmgl-gpt-the-integrative-public-health-model"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with AI assistant (opens in a new tab)"
        >
          <IconMessageChatbot size={18} aria-hidden="true" />
          <span>Chat with AI assistant</span>
        </a>
        <button
          type="button"
          className={`${styles.SideLink} ${styles.Privacy}`}
          onClick={() => setOpened(true)}
          aria-haspopup="dialog"
          aria-expanded={opened}
        >
          <IconShieldCheck size={18} aria-hidden="true" />
          <span>Read me first</span>
        </button>
      </nav>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<h2 className={styles.ModalTitle}>Read me first</h2>}
        classNames={{ header: styles.ModalHeader }}
        size="xl"
        centered
        withCloseButton
        closeOnClickOutside
        closeOnEscape
        closeButtonProps={{ "aria-label": "Close disclaimer", style: { color: "#172b4d", backgroundColor: "#f1f3f5" } }}
      >
        <article className={styles.DisclaimerContent}>
          <p>TMGL includes content contributed by third parties and users. Before using TMGL or relying on any content made available through the platform, please read the <a href={disclaimerUrl} target="_blank" rel="noopener noreferrer">Terms and Conditions of Use</a>, which govern access to and use of TMGL and its content.</p>
        </article>
        <nav aria-label="Terms and institutional pages" className={styles.InstitutionalLinks}>
          {globalConfig?.acf?.privacy_policy_url && (
            <a href={globalConfig.acf.privacy_policy_url} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          )}
          {globalConfig?.acf?.footerimages?.map((institution, index) => (
            <a key={`${institution.url}-${index}`} href={institution.url} target="_blank" rel="noopener noreferrer">
              Institutional website {index + 1}
            </a>
          ))}
        </nav>
      </Modal>
    </>
  );
};
