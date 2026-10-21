import { IconMessageChatbot, IconShieldCheck } from "@tabler/icons-react";
import styles from "../../styles/components/gpt.module.scss";

export const GptWidget = () => (
  <nav className={styles.SideLinks} aria-label="Help and policies">
    <a
      className={`${styles.SideLink} ${styles.Assistant}`}
      href="https://chatgpt.com/g/g-2rwZEsuEj-tmgl-gpt-the-integrative-public-health-model"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our assistant (opens in a new tab)"
    >
      <IconMessageChatbot size={18} aria-hidden="true" />
      <span>Chat with our assistant</span>
    </a>
    <a
      className={`${styles.SideLink} ${styles.Privacy}`}
      href="https://tmgl.org/content/privacy-policy-terms-and-conditions-of-use"
    >
      <IconShieldCheck size={18} aria-hidden="true" />
      <span>Privacy policy, terms and conditions of use</span>
    </a>
  </nav>
);
