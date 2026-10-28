import { IconMessageChatbot, IconShieldCheck } from "@tabler/icons-react";
import styles from "../../styles/components/gpt.module.scss";
import pageStyles from "../../styles/pages/pages.module.scss";
import { Alert, Button, Loader, Modal } from "@mantine/core";
import { useState } from "react";
import { PostsApi } from "@/services/posts/PostsApi";

const disclaimerUrl = process.env.NEXT_PUBLIC_DISCLAIMER_CONTENT?.trim() ||
  "https://tmgl.org/content/privacy-policy-terms-and-conditions-of-use";

export const GptWidget = () => {
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
          aria-label="Chat with our assistant (opens in a new tab)"
        >
          <IconMessageChatbot size={18} aria-hidden="true" />
          <span>Chat with our assistant</span>
        </a>
        <button
          type="button"
          className={`${styles.SideLink} ${styles.Privacy}`}
          onClick={openDisclaimer}
        >
          <IconShieldCheck size={18} aria-hidden="true" />
          <span>Disclaimer</span>
        </button>
      </nav>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Disclaimer" size="xl" centered>
        {loading && <div role="status" aria-label="Loading disclaimer"><Loader /></div>}
        {error && (
          <Alert color="red" title="Unable to load disclaimer">
            <p>Please try again or <a href={disclaimerUrl} target="_blank" rel="noopener noreferrer">open the page</a>.</p>
            <Button onClick={openDisclaimer}>Try again</Button>
          </Alert>
        )}
        {content !== null && <div className={pageStyles.PostContent} dangerouslySetInnerHTML={{ __html: content }} />}
      </Modal>
    </>
  );
};
