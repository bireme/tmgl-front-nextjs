// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

import { FooterLayout, HeaderLayout } from "@/components/layout";

import type { AppProps } from "next/app";
import { GlobalProvider } from "@/contexts/globalContext";
import { MantineProvider } from "@mantine/core";
import { mantineTheme } from "@styles/mantine-theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={mantineTheme}>
      <GlobalProvider>
        <HeaderLayout />
        <Component {...pageProps} />
        <FooterLayout />
      </GlobalProvider>
    </MantineProvider>
  );
}
