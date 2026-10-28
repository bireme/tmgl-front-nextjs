import { IconMessageChatbot, IconShieldCheck } from "@tabler/icons-react";
import styles from "../../styles/components/gpt.module.scss";
import pageStyles from "../../styles/pages/pages.module.scss";
import { Alert, Button, Loader, Modal } from "@mantine/core";
import { useContext, useState } from "react";
import { PostsApi } from "@/services/posts/PostsApi";
import { GlobalContext } from "@/contexts/globalContext";

const disclaimerUrl = process.env.NEXT_PUBLIC_DISCLAIMER_CONTENT?.trim() ||
  "https://tmgl.org/content/privacy-policy-terms-and-conditions-of-use";

export const GptWidget = () => {
  const { globalConfig } = useContext(GlobalContext);
  const [opened, setOpened] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const openDisclaimer = async () => {
    setOpened(true);
    if (content !== null || loading) return;
    setLoading(true);
    setError(false);
    try {
      const url = new URL(disclaimerUrl, window.location.origin);
      const segments = url.pathname.split("/").filter(Boolean);
      const slug = segments.at(-1);
      if (!slug) throw new Error("Missing disclaimer slug");
      const contentIndex = segments.indexOf("content");
      const region = contentIndex > 0 ? segments.slice(0, contentIndex).join("/") : undefined;
      const posts = await new PostsApi(region).getPost("pages", encodeURIComponent(slug));
      const html = posts[0]?.content?.rendered;
      if (!html?.trim()) throw new Error("Disclaimer content unavailable");
      setContent(html);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

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
          onClick={openDisclaimer}
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
        {loading && <div role="status" aria-label="Loading disclaimer"><Loader /></div>}
        {error && (
          <Alert color="red" title="Unable to load disclaimer">
            <p>Please try again or <a href={disclaimerUrl} target="_blank" rel="noopener noreferrer">open the page</a>.</p>
            <Button onClick={openDisclaimer}>Try again</Button>
          </Alert>
        )}
        {content !== null && <div className={pageStyles.PostContent} dangerouslySetInnerHTML={{ __html: content }} />}
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
