import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "../styles/custom-global.scss";

import { Button, MantineProvider, Modal } from "@mantine/core";
import { useEffect, useState } from "react";

import type { AppProps } from "next/app";
import Cookies from "js-cookie";
import { FooterLayout } from "@/components/layout/footer";
import { GlobalConfigLoader } from "@/contexts/GlobalConfigLoader";
import { GlobalProvider } from "@/contexts/globalContext";
import { GptWidget } from "@/components/gpt";
import { HeaderLayout } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { mantineTheme } from "@styles/mantine-theme";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const [warningModal, setWarningModal] = useState(false);
  const router = useRouter();
  const handleAgreeWarning = () => {
    setWarningModal(false);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    const cookieKey = "warningModalShown";
    const cookieValue = Cookies.get(cookieKey);
    if (cookieValue !== today) {
      setWarningModal(true);
      Cookies.set(cookieKey, today, { expires: 1 }); // expira em 1 dia
    }
  }, []);

  return (
    <MantineProvider theme={mantineTheme}>
      <GlobalProvider>
        <GlobalConfigLoader />
        <SkipLink />
        <Modal
          title={"The WHO Traditional  Medicine Global Library"}
          onClose={() => handleAgreeWarning()}
          opened={warningModal}
        >
          <h3>Welcome to TMGL!</h3>
          <p>
            Please note that you are visiting a digital library that is
            currently under development. Every effort has been made to ensure
            the accuracy of the content, but occasional errors or
            inconsistencies may still be present as we refine the platform.
          </p>
          <p>
            We encourage you to join the TMGL community and share your feedback.
            Your input will be invaluable in helping us improve and shape the
            future of TMGL.
          </p>
          <p>
            For more information, please refer to our Terms and Conditions of
            Use, available in the footer of the homepage.
          </p>
          <p>
            Thank you for your understanding and for being a part of the TMGL
            journey!
          </p>
          <Button
            mb={20}
            mt={20}
            onClick={() => handleAgreeWarning()}
            style={{ float: "right" }}
          >
            I Agree
          </Button>
        </Modal>
        <HeaderLayout />
        <main id="main-content">
          <Component {...pageProps} />
        </main>
        <GptWidget />
        <FooterLayout />
      </GlobalProvider>
    </MantineProvider>
  );
}
