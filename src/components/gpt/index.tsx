import { IconMessageChatbot, IconShieldCheck } from "@tabler/icons-react";
import styles from "../../styles/components/gpt.module.scss";
import pageStyles from "../../styles/pages/pages.module.scss";
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
        title="Read me first — Disclaimer"
        size="xl"
        centered
        withCloseButton
        closeOnClickOutside
        closeOnEscape
        closeButtonProps={{ "aria-label": "Close disclaimer", style: { color: "#172b4d", backgroundColor: "#f1f3f5" } }}
      >
        <div className={pageStyles.PostContent}>
          <p>TMGL is a collaborative digital library and global knowledge platform for traditional, complementary and integrative medicine, continuously evolving through contributions from its partners and ongoing curation.</p>
          <p>The inclusion of content in TMGL does not constitute endorsement or recommendation by the World Health Organization (WHO) or its partners. The views and conclusions expressed in the included materials are those of the original authors and do not necessarily reflect the policies or positions of WHO.</p>
          <p>While every effort is made to ensure the accuracy and quality of the information presented, occasional inconsistencies may occur. We welcome your feedback to help us continuously improve TMGL.</p>
          <p>For more information, please refer to the Privacy Policy, Terms and Conditions of Use available in the footer of the homepage.</p>
        </div>
        <nav aria-label="Terms and institutional pages" className={styles.InstitutionalLinks}>
          <a href={globalConfig?.acf?.terms_and_conditions_url || disclaimerUrl} target="_blank" rel="noopener noreferrer">
            Privacy Policy, Terms, and Conditions of Use
          </a>
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
