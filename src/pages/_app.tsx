// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

import { Button, MantineProvider, Modal } from "@mantine/core";
import { FooterLayout, HeaderLayout } from "@/components/layout";
import { use, useEffect, useState } from "react";

import type { AppProps } from "next/app";
import Cookies from "js-cookie";
import { GlobalProvider } from "@/contexts/globalContext";
import { mantineTheme } from "@styles/mantine-theme";

export default function App({ Component, pageProps }: AppProps) {
  const [warningModal, setWarningModal] = useState(false);

  const handleAgreeWarning = () => {
    Cookies.set("warningModalReaded", "true", { expires: 7 });
    setWarningModal(false);
  };

  useEffect(() => {
    const valorDoCookie = Cookies.get("warningModalReaded");
    if (valorDoCookie == "true") {
      setWarningModal(false);
    } else {
      setWarningModal(true);
    }
  }, []);

  return (
    <MantineProvider theme={mantineTheme}>
      <GlobalProvider>
        <Modal
          title={"The WHO Traditional Medicine Global Library"}
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
        <Component {...pageProps} />
        <FooterLayout />
      </GlobalProvider>
    </MantineProvider>
  );
}
