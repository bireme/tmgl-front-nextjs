// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

import type { AppProps } from "next/app";
import { HeaderLayout } from "@/components/layout";
import { MantineProvider } from "@mantine/core";
import { mantineTheme } from "@styles/mantine-theme";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={mantineTheme}>
      <HeaderLayout />
      <Component {...pageProps} />
    </MantineProvider>
  );
}
